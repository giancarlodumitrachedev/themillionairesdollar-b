"use client";

import { Button } from "@/components/ui/button";
import { Tile } from "@/components/wall/tile";
import type { Dict } from "@/lib/i18n";
import type { PublicTile } from "@/lib/supabase/database.types";
import { TIERS, formatEuro, type TierId } from "@/lib/tiers";
import { initialsOf } from "@/lib/utils";
import type { FormData } from "./information-form";

export function Review({
  dict,
  tier,
  form,
  submitting,
  error,
  onBack,
  onConfirm,
}: {
  dict: Dict;
  tier: TierId;
  form: FormData;
  submitting: boolean;
  error: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) {
  // The tile exactly as it will appear once payment completes.
  const preview: PublicTile = {
    id: "preview",
    tile_number: null,
    tier,
    display_name:
      form.displayAs === "initials" ? initialsOf(form.displayName) : form.displayName,
    display_as: form.displayAs,
    country_code: form.countryCode,
    city: form.city || null,
    latitude: null,
    longitude: null,
    year_became_millionaire: form.year ? Number(form.year) : null,
    personal_message: form.message || null,
    is_highlighted: false,
    created_at: new Date().toISOString(),
  };

  return (
    <div>
      <h2 className="font-display text-3xl font-light text-primary">
        {dict.participate.review.title}
      </h2>

      <div className="mx-auto mt-8 max-w-[280px]">
        <Tile tile={preview} size="lg" />
      </div>

      <dl className="mt-8 space-y-2 border-t border-edge pt-6">
        <div className="flex justify-between text-sm">
          <dt className="text-tertiary">{dict.participate.review.tier}</dt>
          <dd className="font-mono uppercase tracking-[0.1em] text-secondary">
            {dict.tiers.names[tier]}
          </dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-tertiary">{dict.participate.review.amount}</dt>
          <dd className="font-mono text-primary">{formatEuro(TIERS[tier].amountCents)}</dd>
        </div>
      </dl>

      {error && (
        <p role="alert" className="mt-6 text-sm text-danger">
          {dict.participate.errors.generic}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <Button onClick={onConfirm} disabled={submitting} className="w-full">
          {submitting ? dict.participate.review.processing : dict.participate.review.continue}
        </Button>
        <Button variant="secondary" onClick={onBack} disabled={submitting} className="w-full">
          {dict.participate.review.edit}
        </Button>
      </div>
    </div>
  );
}
