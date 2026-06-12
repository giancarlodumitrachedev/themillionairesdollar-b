"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import type { Dict } from "@/lib/i18n";
import { formatTileNumber, siteUrl } from "@/lib/utils";

interface TileResult {
  tileNumber: number;
  tileId: string;
}

/**
 * The webhook inserts the participant asynchronously, so this page polls
 * /api/tile-by-session until the tile exists (max ~60s).
 */
export function SuccessContent({ dict, sessionId }: { dict: Dict; sessionId: string | null }) {
  const [tile, setTile] = useState<TileResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    let attempts = 0;
    let stopped = false;

    const poll = async () => {
      if (stopped || attempts > 30) return;
      attempts += 1;
      try {
        const res = await fetch(
          `/api/tile-by-session?session_id=${encodeURIComponent(sessionId)}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const data = (await res.json()) as TileResult | { pending: true };
          if ("tileNumber" in data) {
            setTile(data);
            return;
          }
        }
      } catch {
        // retry
      }
      setTimeout(poll, 2000);
    };
    poll();
    return () => {
      stopped = true;
    };
  }, [sessionId]);

  if (!tile) {
    return (
      <div className="w-full max-w-md">
        <p className="font-display text-2xl font-light italic text-primary">
          {dict.checkout.successPlacing}
        </p>
        <div className="loading-line mt-8" aria-hidden="true" />
        <p className="mt-6 text-sm text-secondary">{dict.checkout.successPlacingNote}</p>
      </div>
    );
  }

  const tileUrl = `${siteUrl()}/tile/${tile.tileId}`;
  const shareText = encodeURIComponent(
    `I exist. ${formatTileNumber(tile.tileNumber)} on The Millionaire's Dollar.`
  );

  return (
    <div className="w-full max-w-xl">
      <p className="font-display text-2xl font-light italic text-secondary">
        {dict.checkout.successTitle}
      </p>
      <p className="mt-4 font-display text-[5rem] font-light leading-none tracking-[-0.03em] text-primary sm:text-[8rem]">
        {formatTileNumber(tile.tileNumber)}
      </p>

      <div className="mt-12">
        <ButtonLink href={`/tile/${tile.tileId}`}>{dict.checkout.viewTile}</ButtonLink>
      </div>

      <p className="mt-12 text-sm text-secondary">{dict.checkout.share}</p>
      <div className="mt-4 flex items-center justify-center gap-6 font-mono text-xs uppercase tracking-[0.15em]">
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(tileUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary transition-colors duration-300 hover:text-primary"
        >
          Twitter
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(tileUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary transition-colors duration-300 hover:text-primary"
        >
          LinkedIn
        </a>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(tileUrl).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            });
          }}
          className="text-secondary transition-colors duration-300 hover:text-primary"
        >
          {copied ? dict.checkout.copied : dict.checkout.copyLink}
        </button>
      </div>

      <p className="mt-16">
        <Link href="/#newsletter" className="link-inline text-sm">
          {dict.checkout.newsletterCta}
        </Link>
      </p>
    </div>
  );
}
