"use client";

import { FieldError, FieldHint, Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/lib/countries";
import type { Dict } from "@/lib/i18n";
import { TIERS, type TierId } from "@/lib/tiers";
import { isValidEmail } from "@/lib/utils";

export interface FormData {
  email: string;
  displayName: string;
  displayAs: "initials" | "full_name";
  countryCode: string;
  city: string;
  year: string;
  message: string;
  linkedinUrl: string;
  businessEmail: string;
  sourceOfWealth: string;
  phone: string;
  consentParticipation: boolean;
  consentFutureContact: boolean;
  consentNewsletter: boolean;
  /** Honeypot — humans never fill this. */
  website: string;
}

export const EMPTY_FORM: FormData = {
  email: "",
  displayName: "",
  displayAs: "initials",
  countryCode: "",
  city: "",
  year: "",
  message: "",
  linkedinUrl: "",
  businessEmail: "",
  sourceOfWealth: "",
  phone: "",
  consentParticipation: false,
  consentFutureContact: false,
  consentNewsletter: false,
  website: "",
};

export function validateForm(form: FormData, dict: Dict): Partial<Record<keyof FormData, string>> {
  const errors: Partial<Record<keyof FormData, string>> = {};
  if (!isValidEmail(form.email)) errors.email = dict.participate.errors.email;
  if (!form.displayName.trim() || form.displayName.length > 32)
    errors.displayName = dict.participate.errors.displayName;
  if (!form.countryCode) errors.countryCode = dict.participate.errors.country;
  if (form.message.length > 60) errors.message = dict.participate.errors.message;
  if (form.year) {
    const y = Number(form.year);
    if (!Number.isInteger(y) || y < 1950 || y > new Date().getFullYear())
      errors.year = dict.participate.errors.year;
  }
  if (!form.consentParticipation) errors.consentParticipation = dict.participate.errors.consent;
  return errors;
}

export function InformationForm({
  dict,
  tier,
  form,
  errors,
  onChange,
  onSubmit,
}: {
  dict: Dict;
  tier: TierId;
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  onChange: (next: FormData) => void;
  onSubmit: () => void;
}) {
  const f = dict.participate.fields;
  const config = TIERS[tier];
  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    onChange({ ...form, [key]: value });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="p-email">{f.email}</Label>
        <Input
          id="p-email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "p-email-err" : undefined}
          onChange={(e) => set("email", e.target.value)}
        />
        <FieldHint>{f.emailHint}</FieldHint>
        <FieldError id="p-email-err">{errors.email}</FieldError>
      </div>

      <div>
        <Label htmlFor="p-name">{f.displayName}</Label>
        <Input
          id="p-name"
          maxLength={32}
          autoComplete="name"
          required
          value={form.displayName}
          aria-invalid={!!errors.displayName}
          onChange={(e) => set("displayName", e.target.value)}
        />
        <FieldHint>{f.displayNameHint}</FieldHint>
        <FieldError>{errors.displayName}</FieldError>
      </div>

      <fieldset>
        <legend className="mb-2 block font-body text-sm text-secondary">{f.showAs}</legend>
        <div className="flex gap-6">
          {(
            [
              ["initials", f.initialsOnly],
              ["full_name", f.fullName],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-primary">
              <input
                type="radio"
                name="displayAs"
                value={value}
                checked={form.displayAs === value}
                onChange={() => set("displayAs", value)}
                className="h-4 w-4 accent-[#8b7355]"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <Label htmlFor="p-country">{f.country}</Label>
        <Select
          id="p-country"
          required
          value={form.countryCode}
          aria-invalid={!!errors.countryCode}
          onChange={(e) => set("countryCode", e.target.value)}
        >
          <option value="" disabled>
            —
          </option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </Select>
        <FieldError>{errors.countryCode}</FieldError>
      </div>

      <div>
        <Label htmlFor="p-city">{f.city}</Label>
        <Input
          id="p-city"
          autoComplete="address-level2"
          value={form.city}
          onChange={(e) => set("city", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="p-year">{f.year}</Label>
        <Input
          id="p-year"
          type="number"
          inputMode="numeric"
          min={1950}
          max={new Date().getFullYear()}
          value={form.year}
          aria-invalid={!!errors.year}
          onChange={(e) => set("year", e.target.value)}
        />
        <FieldError>{errors.year}</FieldError>
      </div>

      <div>
        <Label htmlFor="p-message">{f.message}</Label>
        <Input
          id="p-message"
          maxLength={60}
          value={form.message}
          aria-invalid={!!errors.message}
          aria-describedby="p-message-count"
          onChange={(e) => set("message", e.target.value)}
        />
        <p id="p-message-count" className="mt-1.5 text-right font-mono text-[10px] text-tertiary">
          {form.message.length}/60
        </p>
        <FieldError>{errors.message}</FieldError>
      </div>

      {config.collectsIdentity && (
        <div className="space-y-6 border-t border-edge pt-6">
          <p className="text-xs text-tertiary">{f.highTierNote}</p>
          <div>
            <Label htmlFor="p-linkedin">{f.linkedin}</Label>
            <Input
              id="p-linkedin"
              type="url"
              placeholder="https://linkedin.com/in/…"
              value={form.linkedinUrl}
              onChange={(e) => set("linkedinUrl", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="p-bizemail">{f.businessEmail}</Label>
            <Input
              id="p-bizemail"
              type="email"
              value={form.businessEmail}
              onChange={(e) => set("businessEmail", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="p-wealth">{f.sourceOfWealth}</Label>
            <Input
              id="p-wealth"
              maxLength={200}
              value={form.sourceOfWealth}
              onChange={(e) => set("sourceOfWealth", e.target.value)}
            />
          </div>
          {config.collectsPhone && (
            <div>
              <Label htmlFor="p-phone">{f.phone}</Label>
              <Input
                id="p-phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {/* Honeypot — visually hidden, ignored by humans, filled by naive bots */}
      <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
        <label htmlFor="p-website">Website</label>
        <input
          id="p-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      <div className="space-y-4 border-t border-edge pt-6">
        {(
          [
            ["consentParticipation", dict.participate.consents.participation, true],
            ["consentFutureContact", dict.participate.consents.futureContact, false],
            ["consentNewsletter", dict.participate.consents.newsletter, false],
          ] as const
        ).map(([key, label, required]) => (
          <div key={key}>
            <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm text-secondary">
              <input
                type="checkbox"
                checked={form[key]}
                required={required}
                aria-invalid={key === "consentParticipation" && !!errors.consentParticipation}
                onChange={(e) => set(key, e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#8b7355]"
              />
              <span>
                {label}
                {required ? " *" : ""}
              </span>
            </label>
            {key === "consentParticipation" && (
              <FieldError>{errors.consentParticipation}</FieldError>
            )}
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full">
        {dict.participate.next}
      </Button>
    </form>
  );
}
