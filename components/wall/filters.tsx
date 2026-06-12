"use client";

import type { Dict } from "@/lib/i18n";
import { TIER_ORDER, type TierId } from "@/lib/tiers";
import { countryName } from "@/lib/countries";
import type { WallFilters } from "@/hooks/use-participants";

export function Filters({
  dict,
  filters,
  onChange,
  countries,
}: {
  dict: Dict;
  filters: WallFilters;
  onChange: (next: WallFilters) => void;
  countries: string[];
}) {
  const currentYear = new Date().getFullYear();
  const selectClass =
    "rounded-sm border border-edge bg-bg-elevated px-3 py-2 font-mono text-xs text-secondary focus:border-accent focus:outline-none";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="sr-only" htmlFor="filter-country">
        {dict.wall.filters.country}
      </label>
      <select
        id="filter-country"
        className={selectClass}
        value={filters.country ?? ""}
        onChange={(e) => onChange({ ...filters, country: e.target.value || null })}
      >
        <option value="">{dict.wall.filters.allCountries}</option>
        {countries.map((code) => (
          <option key={code} value={code}>
            {countryName(code) ?? code}
          </option>
        ))}
      </select>

      <fieldset className="flex flex-wrap items-center gap-1.5">
        <legend className="sr-only">{dict.wall.filters.tier}</legend>
        {TIER_ORDER.map((id) => {
          const active = filters.tiers.includes(id);
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() =>
                onChange({
                  ...filters,
                  tiers: active
                    ? filters.tiers.filter((t) => t !== id)
                    : [...filters.tiers, id as TierId],
                })
              }
              className={`rounded-sm border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors duration-300 ${
                active
                  ? "border-accent text-accent-bright"
                  : "border-edge text-tertiary hover:text-secondary"
              }`}
            >
              {dict.tiers.names[id]}
            </button>
          );
        })}
      </fieldset>

      <label className="sr-only" htmlFor="filter-year-from">
        {dict.wall.filters.year}
      </label>
      <div className="flex items-center gap-1.5">
        <input
          id="filter-year-from"
          type="number"
          inputMode="numeric"
          min={1950}
          max={currentYear}
          placeholder="1950"
          className={`${selectClass} w-20`}
          value={filters.yearFrom ?? ""}
          onChange={(e) =>
            onChange({ ...filters, yearFrom: e.target.value ? Number(e.target.value) : null })
          }
        />
        <span className="text-tertiary">—</span>
        <input
          aria-label={dict.wall.filters.year}
          type="number"
          inputMode="numeric"
          min={1950}
          max={currentYear}
          placeholder={String(currentYear)}
          className={`${selectClass} w-20`}
          value={filters.yearTo ?? ""}
          onChange={(e) =>
            onChange({ ...filters, yearTo: e.target.value ? Number(e.target.value) : null })
          }
        />
      </div>

      <label className="sr-only" htmlFor="filter-order">
        {dict.wall.filters.order}
      </label>
      <select
        id="filter-order"
        className={selectClass}
        value={filters.order}
        onChange={(e) =>
          onChange({ ...filters, order: e.target.value as WallFilters["order"] })
        }
      >
        <option value="newest">{dict.wall.filters.newest}</option>
        <option value="oldest">{dict.wall.filters.oldest}</option>
        <option value="random">{dict.wall.filters.random}</option>
      </select>
    </div>
  );
}
