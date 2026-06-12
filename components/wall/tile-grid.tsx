"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FixedSizeGrid, type GridChildComponentProps } from "react-window";
import { Filters } from "@/components/wall/filters";
import { Tile } from "@/components/wall/tile";
import { TileModal } from "@/components/wall/tile-modal";
import { DEFAULT_FILTERS, useParticipants, type WallFilters } from "@/hooks/use-participants";
import { useRealtimeCounter } from "@/hooks/use-realtime-counter";
import type { Dict, Locale } from "@/lib/i18n";
import type { PublicTile } from "@/lib/supabase/database.types";
import { formatCount } from "@/lib/utils";

interface CellData {
  tiles: PublicTile[];
  columnCount: number;
  gap: number;
  onSelect: (tile: PublicTile) => void;
}

function Cell({ columnIndex, rowIndex, style, data }: GridChildComponentProps<CellData>) {
  const index = rowIndex * data.columnCount + columnIndex;
  const tile = data.tiles[index];
  if (!tile) return null;
  return (
    <div style={{ ...style, padding: data.gap / 2 }}>
      <Tile tile={tile} onClick={() => data.onSelect(tile)} />
    </div>
  );
}

/**
 * The full Wall: sticky header (live counter + filters) above a virtualized
 * grid that handles tens of thousands of tiles without breaking a sweat.
 */
export function TileGrid({
  dict,
  locale,
  initialCount,
  countries,
}: {
  dict: Dict;
  locale: Locale;
  initialCount: number;
  countries: string[];
}) {
  const [filters, setFilters] = useState<WallFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<PublicTile | null>(null);
  const { tiles, loading, loadMore } = useParticipants(filters);
  const { count } = useRealtimeCounter(initialCount);

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () =>
      setSize({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { tileSize, gap } = useMemo(() => {
    if (size.width >= 1024) return { tileSize: 180, gap: 8 };
    if (size.width >= 640) return { tileSize: 140, gap: 6 };
    return { tileSize: 100, gap: 4 };
  }, [size.width]);

  const columnCount = Math.max(2, Math.floor(size.width / (tileSize + gap)));
  const rowCount = Math.ceil(tiles.length / columnCount);
  const cellSize = Math.floor(size.width / columnCount);

  const itemData = useMemo<CellData>(
    () => ({ tiles, columnCount, gap, onSelect: setSelected }),
    [tiles, columnCount, gap]
  );

  const onItemsRendered = useCallback(
    ({ visibleRowStopIndex }: { visibleRowStopIndex: number }) => {
      if (visibleRowStopIndex >= rowCount - 4) loadMore();
    },
    [rowCount, loadMore]
  );

  return (
    <div className="flex h-svh flex-col pt-16 sm:pt-20">
      <div className="border-b border-edge bg-bg">
        <div className="container-site flex flex-col gap-4 py-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-secondary">
            {formatCount(count, locale)} {dict.wall.declarations}
          </p>
          <Filters dict={dict} filters={filters} onChange={setFilters} countries={countries} />
        </div>
        {loading && <div className="loading-line" aria-hidden="true" />}
      </div>

      <div ref={containerRef} className="flex-1">
        {size.width > 0 && tiles.length > 0 && (
          <FixedSizeGrid
            columnCount={columnCount}
            columnWidth={cellSize}
            rowCount={rowCount}
            rowHeight={cellSize}
            width={size.width}
            height={size.height}
            itemData={itemData}
            onItemsRendered={onItemsRendered}
            overscanRowCount={4}
          >
            {Cell}
          </FixedSizeGrid>
        )}
        {!loading && tiles.length === 0 && (
          <p className="py-24 text-center font-display text-xl font-light italic text-tertiary">
            {dict.wall.empty}
          </p>
        )}
      </div>

      <TileModal tile={selected} onClose={() => setSelected(null)} dict={dict} locale={locale} />
    </div>
  );
}
