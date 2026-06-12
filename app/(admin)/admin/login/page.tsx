import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-svh items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <p className="font-display text-2xl text-primary">M.D.</p>
        <h1 className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-tertiary">
          The Curators — internal
        </h1>
        {params.error === "not_authorized" && (
          <p role="alert" className="mt-6 text-sm text-danger">
            This email is not on the whitelist.
          </p>
        )}
        {params.error === "auth" && (
          <p role="alert" className="mt-6 text-sm text-danger">
            The link is invalid or expired. Request a new one.
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
