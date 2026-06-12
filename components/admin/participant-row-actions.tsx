"use client";

import { useTransition } from "react";
import { setHighlighted, setTilePublic } from "@/app/(admin)/admin/(dashboard)/actions";

export function ParticipantRowActions({
  id,
  isPublic,
  isHighlighted,
}: {
  id: string;
  isPublic: boolean;
  isHighlighted: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const btn =
    "rounded-sm border border-edge px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-secondary transition-colors duration-200 hover:border-edge-strong hover:text-primary disabled:opacity-40";

  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        disabled={pending}
        className={btn}
        onClick={() => startTransition(() => setTilePublic(id, !isPublic))}
      >
        {isPublic ? "Hide" : "Restore"}
      </button>
      <button
        type="button"
        disabled={pending}
        className={btn}
        onClick={() => startTransition(() => setHighlighted(id, !isHighlighted))}
      >
        {isHighlighted ? "Unstar" : "Star"}
      </button>
    </div>
  );
}
