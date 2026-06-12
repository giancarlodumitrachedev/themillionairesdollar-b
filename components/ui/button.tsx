"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const base =
  "inline-flex items-center justify-center rounded-sm px-8 py-4 font-body text-sm font-medium uppercase tracking-[0.1em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40";

const variants = {
  primary: "border border-primary bg-bg text-primary hover:bg-primary hover:text-bg",
  secondary: "border border-tertiary bg-transparent text-secondary hover:border-secondary hover:text-primary",
} as const;

type Variant = keyof typeof variants;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ href, variant = "primary", className, children }: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
