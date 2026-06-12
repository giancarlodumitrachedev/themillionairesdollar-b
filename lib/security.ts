import { createHmac, timingSafeEqual } from "crypto";

function secret(): string {
  // Server-only secret reused for signing short-lived tokens.
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? "dev-secret-do-not-use-in-production";
}

/** HMAC-signed token: payload.expiry.signature (base64url). Used for deletion confirmations. */
export function signToken(payload: string, ttlMs: number): string {
  const exp = Date.now() + ttlMs;
  const data = `${payload}.${exp}`;
  const sig = createHmac("sha256", secret()).update(data).digest("base64url");
  return `${Buffer.from(payload).toString("base64url")}.${exp}.${sig}`;
}

export function verifyToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [b64payload, expStr, sig] = parts as [string, string, string];

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return null;

  const payload = Buffer.from(b64payload, "base64url").toString();
  const expected = createHmac("sha256", secret()).update(`${payload}.${exp}`).digest("base64url");

  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return payload;
}

/**
 * Naive per-IP rate limiter. In-memory, so per-serverless-instance only —
 * production hardening belongs at the Cloudflare layer (see README).
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= max) return false;
  bucket.count += 1;
  return true;
}

/** Verify a Cloudflare Turnstile token if the secret is configured; permissive otherwise. */
export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const key = process.env.TURNSTILE_SECRET_KEY;
  if (!key) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: key, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(4000),
    });
    const data = (await res.json()) as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
}
