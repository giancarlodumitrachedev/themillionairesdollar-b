"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });
    setState(error ? "error" : "sent");
  };

  if (state === "sent") {
    return (
      <p className="mt-8 text-sm text-secondary">
        Check your inbox. The magic link signs you in.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      <div>
        <Label htmlFor="admin-email">Email</Label>
        <Input
          id="admin-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {state === "error" && (
        <p role="alert" className="text-sm text-danger">
          Could not send the link. Try again.
        </p>
      )}
      <Button type="submit" disabled={state === "sending"} className="w-full">
        {state === "sending" ? "Sending…" : "Send magic link"}
      </Button>
    </form>
  );
}
