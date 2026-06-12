"use client";

import { useEffect, useRef, useState } from "react";
import { InformationForm, type FormData, EMPTY_FORM, validateForm } from "./information-form";
import { Review } from "./review";
import { TierSelector } from "./tier-selector";
import type { Dict } from "@/lib/i18n";
import { isTierId, type TierId } from "@/lib/tiers";

export function ParticipateFlow({
  dict,
  availability,
  preselectedTier,
}: {
  dict: Dict;
  availability: Record<TierId, boolean>;
  preselectedTier: string | null;
}) {
  const initialTier =
    preselectedTier && isTierId(preselectedTier) && availability[preselectedTier]
      ? preselectedTier
      : null;

  const [tier, setTier] = useState<TierId | null>(initialTier);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [step, setStep] = useState<1 | 2 | 3>(initialTier ? 2 : 1);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step === 2) formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (step === 3) reviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const selectTier = (id: TierId) => {
    setTier(id);
    setStep(2);
  };

  const toReview = () => {
    const nextErrors = validateForm(form, dict);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setStep(3);
  };

  const checkout = async () => {
    if (!tier || submitting) return;
    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, ...form }),
      });
      const data = (await res.json()) as { url?: string };
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setSubmitError(true);
    } catch {
      setSubmitError(true);
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-24 pb-32">
      <section aria-labelledby="step-tier">
        <p id="step-tier" className="eyebrow container-site">
          {dict.participate.step1}
        </p>
        <div className="container-site mt-8">
          <TierSelector
            dict={dict}
            availability={availability}
            selected={tier}
            onSelect={selectTier}
          />
        </div>
      </section>

      {step >= 2 && tier && (
        <section ref={formRef} aria-labelledby="step-form" className="scroll-mt-24">
          <p id="step-form" className="eyebrow container-site">
            {dict.participate.step2}
          </p>
          <div className="mx-auto mt-8 max-w-[560px] px-5 sm:px-8">
            <InformationForm
              dict={dict}
              tier={tier}
              form={form}
              errors={errors}
              onChange={setForm}
              onSubmit={toReview}
            />
          </div>
        </section>
      )}

      {step === 3 && tier && (
        <section ref={reviewRef} aria-labelledby="step-review" className="scroll-mt-24">
          <p id="step-review" className="eyebrow container-site">
            {dict.participate.step3}
          </p>
          <div className="mx-auto mt-8 max-w-[560px] px-5 sm:px-8">
            <Review
              dict={dict}
              tier={tier}
              form={form}
              submitting={submitting}
              error={submitError}
              onBack={() => setStep(2)}
              onConfirm={checkout}
            />
          </div>
        </section>
      )}
    </div>
  );
}
