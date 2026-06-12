"use client";

import { useState, useTransition } from "react";
import { setVettingStatus } from "@/app/(admin)/admin/(dashboard)/actions";

const STATUSES = ["pending", "in_progress", "approved", "rejected"] as const;

export function VettingActions({ id, current }: { id: string; current: string }) {
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-edge pt-4">
      <label htmlFor={`note-${id}`} className="sr-only">
        Vetting note
      </label>
      <input
        id={`note-${id}`}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note…"
        className="min-w-48 flex-1 rounded-sm border border-edge bg-bg px-3 py-2 text-sm text-primary placeholder:text-tertiary focus:border-accent focus:outline-none"
      />
      {STATUSES.map((status) => (
        <button
          key={status}
          type="button"
          disabled={pending || status === current}
          onClick={() =>
            startTransition(async () => {
              await setVettingStatus(id, status, note);
              setNote("");
            })
          }
          className="rounded-sm border border-edge px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-secondary transition-colors duration-200 hover:border-edge-strong hover:text-primary disabled:opacity-40"
        >
          {status.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}
