"use client";

import { useTransition } from "react";
import { deletePress } from "@/app/(admin)/admin/(dashboard)/actions";

export function PressDeleteButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this coverage entry?")) {
          startTransition(() => deletePress(id));
        }
      }}
      className="shrink-0 rounded-sm border border-edge px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-tertiary transition-colors duration-200 hover:border-danger hover:text-danger disabled:opacity-40"
    >
      Delete
    </button>
  );
}
