import { NextResponse } from "next/server";
import { getTierAvailability } from "@/lib/public-data";

export async function GET() {
  const { availability } = await getTierAvailability();
  return NextResponse.json(
    { availability },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}
