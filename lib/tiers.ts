export type TierId =
  | "existence"
  | "verified"
  | "founding"
  | "permanent"
  | "patron"
  | "curators_circle";

export interface TierConfig {
  id: TierId;
  /** Amount in EUR cents, charged via Stripe Checkout. */
  amountCents: number;
  /** Stripe line-item product name. */
  productName: string;
  /** Total project revenue (cents) required before this tier opens. */
  revenueThresholdCents: number;
  /** Extra private fields collected at €500+ / €5K+. */
  collectsIdentity: boolean;
  collectsPhone: boolean;
  /** High tiers enter the vetting queue. */
  requiresVetting: boolean;
}

export const TIERS: Record<TierId, TierConfig> = {
  existence: {
    id: "existence",
    amountCents: 500,
    productName: "Existence Tile",
    revenueThresholdCents: 0,
    collectsIdentity: false,
    collectsPhone: false,
    requiresVetting: false,
  },
  verified: {
    id: "verified",
    amountCents: 5_000,
    productName: "Verified Tile",
    revenueThresholdCents: 0,
    collectsIdentity: false,
    collectsPhone: false,
    requiresVetting: true,
  },
  founding: {
    id: "founding",
    amountCents: 50_000,
    productName: "Founding Tile",
    revenueThresholdCents: 500_000, // > €5K
    collectsIdentity: true,
    collectsPhone: false,
    requiresVetting: true,
  },
  permanent: {
    id: "permanent",
    amountCents: 500_000,
    productName: "Permanent Tile",
    revenueThresholdCents: 1_500_000, // > €15K
    collectsIdentity: true,
    collectsPhone: true,
    requiresVetting: true,
  },
  patron: {
    id: "patron",
    amountCents: 2_500_000,
    productName: "Patron Tile",
    revenueThresholdCents: 3_000_000, // > €30K
    collectsIdentity: true,
    collectsPhone: true,
    requiresVetting: true,
  },
  curators_circle: {
    id: "curators_circle",
    amountCents: 3_000_000,
    productName: "Curators Circle Participation",
    revenueThresholdCents: 10_000_000, // > €100K
    collectsIdentity: true,
    collectsPhone: true,
    requiresVetting: true,
  },
};

export const TIER_ORDER: TierId[] = [
  "existence",
  "verified",
  "founding",
  "permanent",
  "patron",
  "curators_circle",
];

export function isTierId(value: string): value is TierId {
  return value in TIERS;
}

export type TierOverride = "auto" | "enabled" | "disabled";
export type TierOverrides = Partial<Record<TierId, TierOverride>>;

/** A tier is open when revenue passed its threshold, unless the admin forced it on/off. */
export function computeAvailability(
  revenueCents: number,
  overrides: TierOverrides
): Record<TierId, boolean> {
  const result = {} as Record<TierId, boolean>;
  for (const id of TIER_ORDER) {
    const override = overrides[id] ?? "auto";
    if (override === "enabled") result[id] = true;
    else if (override === "disabled") result[id] = false;
    else result[id] = revenueCents >= TIERS[id].revenueThresholdCents;
  }
  return result;
}

export function formatEuro(cents: number, opts?: { compact?: boolean }): string {
  const euros = cents / 100;
  if (opts?.compact && euros >= 1000) {
    return `€${euros % 1000 === 0 ? `${euros / 1000}K` : euros.toLocaleString("en-IE")}`;
  }
  return `€${euros.toLocaleString("en-IE", { maximumFractionDigits: 0 })}`;
}
