import { ImageResponse } from "next/og";
import { countryName } from "@/lib/countries";
import { getTileById } from "@/lib/public-data";
import { formatTileNumber } from "@/lib/utils";

export const runtime = "edge";
export const alt = "A tile on The Millionaire's Dollar Wall";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TileOgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tile = await getTileById(id);

  const number = formatTileNumber(tile?.tile_number);
  const name = tile?.display_name ?? "—";
  const place = tile
    ? [tile.city, countryName(tile.country_code) ?? tile.country_code].filter(Boolean).join(", ")
    : "";
  const year = tile?.year_became_millionaire ? String(tile.year_became_millionaire) : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
        }}
      >
        <div
          style={{
            width: 380,
            height: 380,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#141414",
            border: "1px solid #3a3a3a",
            padding: 32,
          }}
        >
          <span style={{ fontSize: 22, color: "#6b6862", fontFamily: "monospace" }}>{number}</span>
          <span
            style={{
              fontSize: name.length > 12 ? 44 : 64,
              color: "#f5f3ee",
              fontFamily: "Georgia, serif",
              fontWeight: 400,
            }}
          >
            {name}
          </span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 18,
                color: "#6b6862",
                fontFamily: "monospace",
                textTransform: "uppercase",
              }}
            >
              {place}
            </span>
            {year && (
              <span style={{ fontSize: 18, color: "#6b6862", fontFamily: "monospace" }}>{year}</span>
            )}
          </div>
        </div>
        <span
          style={{
            marginTop: 48,
            fontSize: 22,
            letterSpacing: 6,
            color: "#a8a59e",
            fontFamily: "monospace",
            textTransform: "uppercase",
          }}
        >
          The Millionaire&apos;s Dollar
        </span>
      </div>
    ),
    size
  );
}
