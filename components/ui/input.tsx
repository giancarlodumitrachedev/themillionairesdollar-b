"use client";

import { cn } from "@/lib/utils";
import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const fieldBase =
  "w-full rounded-sm border border-edge bg-bg-elevated p-4 font-body text-base text-primary placeholder:text-tertiary transition-colors duration-200 focus:border-accent focus:outline-none";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "min-h-24 resize-y", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, "appearance-none", className)} {...props}>
      {children}
    </select>
  );
}

export function Label({ className, children, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-2 block font-body text-sm text-secondary", className)}
      {...props}
    >
      {children}
    </label>
  );
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-tertiary">{children}</p>;
}

export function FieldError({ id, children }: { id?: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 animate-[fade-in_200ms_ease-out] text-xs text-danger">
      {children}
    </p>
  );
}
