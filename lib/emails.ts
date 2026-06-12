import { Resend } from "resend";
import { formatTileNumber, siteUrl } from "./utils";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function fromAddress(): string {
  return process.env.EMAIL_FROM ?? "The Curators <onboarding@resend.dev>";
}

/**
 * Welcome email — plain text by design (PRD §12.1):
 * no images, no logos, no buttons.
 */
export async function sendWelcomeEmail(
  to: string,
  tileNumber: number,
  tileId: string
): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const n = formatTileNumber(tileNumber);
  const text = [
    "Your tile is now part of the Wall.",
    "",
    `You are number ${n}.`,
    "",
    `View it here: ${siteUrl()}/tile/${tileId}`,
    "Share it if you wish.",
    "",
    "We're glad you exist.",
    "",
    "— The Curators",
  ].join("\n");

  await resend.emails.send({
    from: fromAddress(),
    to,
    subject: `Welcome to the Wall, ${n}`,
    text,
  });
}

export async function sendRemovalEmail(to: string, tileNumber: number): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const n = formatTileNumber(tileNumber);
  const text = [
    `Your tile ${n} has been removed from the Wall, as requested.`,
    "",
    "Per our terms, contributions are not refunded.",
    "",
    "If you change your mind in the future, you may participate again.",
    "",
    "— The Curators",
  ].join("\n");

  await resend.emails.send({
    from: fromAddress(),
    to,
    subject: "Your tile has been removed",
    text,
  });
}

export async function sendDeletionConfirmRequest(to: string, confirmUrl: string): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const text = [
    "We received a request to remove your tile from the Wall.",
    "",
    "If it was you, confirm here:",
    confirmUrl,
    "",
    "The link expires in 48 hours. If you did not ask for this, ignore this email — nothing will change.",
    "",
    "— The Curators",
  ].join("\n");

  await resend.emails.send({
    from: fromAddress(),
    to,
    subject: "Confirm the removal of your tile",
    text,
  });
}

/** Dark, serif-titled HTML shell for the weekly newsletter (PRD §12.3). */
export function newsletterHtml(subject: string, paragraphs: string[]): string {
  const body = paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 20px;font-family:Inter,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.7;color:#a8a59e;">${p}</p>`
    )
    .join("\n");

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
    <tr><td align="center" style="padding:48px 20px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="padding-bottom:40px;">
          <span style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:#f5f3ee;">M.D.</span>
        </td></tr>
        <tr><td style="padding-bottom:32px;">
          <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:28px;line-height:1.15;color:#f5f3ee;">${subject}</h1>
        </td></tr>
        <tr><td>${body}</td></tr>
        <tr><td style="border-top:1px solid #2a2a2a;padding-top:24px;padding-bottom:8px;">
          <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#6b6862;">
            © MMXXVI The Curators — <a href="${siteUrl()}" style="color:#6b6862;">themillionairesdollar.com</a>
          </p>
          <p style="margin:8px 0 0;font-family:'Courier New',monospace;font-size:10px;color:#6b6862;">
            <a href="${siteUrl()}/api/newsletter/unsubscribe?email={{EMAIL}}" style="color:#6b6862;">Unsubscribe</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendNewsletterBatch(
  recipients: string[],
  subject: string,
  paragraphs: string[]
): Promise<{ sent: number; failed: number }> {
  const resend = getResend();
  if (!resend) return { sent: 0, failed: recipients.length };

  const html = newsletterHtml(subject, paragraphs);
  let sent = 0;
  let failed = 0;

  // Resend batch endpoint accepts up to 100 messages per call.
  for (let i = 0; i < recipients.length; i += 100) {
    const chunk = recipients.slice(i, i + 100);
    try {
      await resend.batch.send(
        chunk.map((to) => ({
          from: fromAddress(),
          to,
          subject,
          html: html.replace("{{EMAIL}}", encodeURIComponent(to)),
        }))
      );
      sent += chunk.length;
    } catch {
      failed += chunk.length;
    }
  }
  return { sent, failed };
}
