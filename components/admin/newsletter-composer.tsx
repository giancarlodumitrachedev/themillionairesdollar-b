"use client";

import { useState, useTransition } from "react";
import { sendNewsletter } from "@/app/(admin)/admin/(dashboard)/actions";

export function NewsletterComposer() {
  const [result, setResult] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const input =
    "w-full rounded-sm border border-edge bg-bg-elevated px-3 py-2 text-sm text-primary placeholder:text-tertiary focus:border-accent focus:outline-none";

  const submit = (formData: FormData) => {
    setResult(null);
    startTransition(async () => {
      try {
        const r = await sendNewsletter(formData);
        setResult(`Sent: ${r.sent} — failed: ${r.failed}`);
      } catch {
        setResult("Send failed. Check RESEND_API_KEY and EMAIL_FROM.");
      }
    });
  };

  return (
    <form action={submit} className="mt-8 max-w-xl space-y-3">
      <label className="block">
        <span className="mb-1 block text-sm text-secondary">Subject</span>
        <input name="subject" required className={input} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-secondary">
          Body — blank lines separate paragraphs
        </span>
        <textarea name="body" required rows={10} className={input} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-secondary">Audience</span>
        <select name="audience" className={input}>
          <option value="subscribers">Newsletter subscribers</option>
          <option value="participants">Participants with consent</option>
          <option value="all">Both (deduplicated)</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-secondary">
          Test send to (leave empty for the real blast)
        </span>
        <input name="test_to" type="email" placeholder="you@example.com" className={input} />
      </label>

      {result && <p className="font-mono text-xs text-secondary">{result}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-sm border border-primary px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-primary transition-colors duration-300 hover:bg-primary hover:text-bg disabled:opacity-40"
      >
        {pending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
