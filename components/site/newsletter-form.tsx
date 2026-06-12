"use client";

import { useState } from "react";
import type { Dict } from "@/lib/i18n";

export function NewsletterForm({ dict, source }: { dict: Dict; source: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, website: "" }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return <p className="mt-4 text-sm text-secondary">{dict.footer.subscribed}</p>;
  }

  return (
    <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
      <label htmlFor={`newsletter-${source}`} className="sr-only">
        {dict.footer.newsletterPlaceholder}
      </label>
      <input
        id={`newsletter-${source}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={dict.footer.newsletterPlaceholder}
        className="w-full rounded-sm border border-edge bg-bg-elevated px-4 py-3 font-body text-sm text-primary placeholder:text-tertiary focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="shrink-0 rounded-sm border border-tertiary px-5 py-3 font-body text-xs font-medium uppercase tracking-[0.1em] text-secondary transition-colors duration-300 hover:border-secondary hover:text-primary disabled:opacity-40"
      >
        {state === "sending" ? "…" : dict.footer.subscribe}
      </button>
      {state === "error" && (
        <p role="alert" className="text-xs text-danger sm:hidden">
          —
        </p>
      )}
    </form>
  );
}
