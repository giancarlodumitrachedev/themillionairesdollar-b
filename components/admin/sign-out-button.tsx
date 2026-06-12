"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await createClient().auth.signOut();
        router.push("/admin/login");
      }}
      className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-tertiary transition-colors duration-200 hover:text-primary"
    >
      Sign out
    </button>
  );
}
