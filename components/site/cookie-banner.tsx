"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dict } from "@/lib/i18n";

const STORAGE_KEY = "md-cookie-ack";

export function CookieBanner({ dict }: { dict: Dict }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-edge bg-bg-elevated"
    >
      <div className="container-site flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-secondary">
          {dict.cookie.text}{" "}
          <Link href="/privacy" className="link-inline">
            {dict.cookie.more}
          </Link>
        </p>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, "1");
            setVisible(false);
          }}
          className="shrink-0 border border-tertiary px-5 py-2.5 font-body text-xs font-medium uppercase tracking-[0.1em] text-secondary transition-colors duration-300 hover:border-secondary hover:text-primary"
        >
          {dict.cookie.ok}
        </button>
      </div>
    </div>
  );
}
