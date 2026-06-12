import { ImageResponse } from "next/og";
import { getPublicStats } from "@/lib/public-data";

export const runtime = "edge";
export const alt = "The Millionaire's Dollar — Millionaires exist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function DefaultOgImage() {
  let count = 0;
  try {
    const stats = await getPublicStats();
    count = stats.total_participants ?? 0;
  } catch {
    // render without a live number
  }

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
        <span
          style={{
            fontSize: 220,
            color: "#f5f3ee",
            fontFamily: "Georgia, serif",
            fontWeight: 300,
            lineHeight: 1,
          }}
        >
          {count.toLocaleString("en-IE")}
        </span>
        <span
          style={{
            marginTop: 24,
            fontSize: 28,
            letterSpacing: 12,
            color: "#a8a59e",
            fontFamily: "monospace",
            textTransform: "uppercase",
          }}
        >
          Millionaires exist
        </span>
        <span
          style={{
            marginTop: 80,
            fontSize: 18,
            letterSpacing: 3,
            color: "#6b6862",
            fontFamily: "monospace",
          }}
        >
          themillionairesdollar.com
        </span>
      </div>
    ),
    size
  );
}
