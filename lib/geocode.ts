import { countryName } from "./countries";

interface GeoPoint {
  latitude: number;
  longitude: number;
}

/**
 * Best-effort geocoding of "city, country" via Nominatim (OpenStreetMap),
 * with a random jitter of ±5km so tiles never reveal an exact location.
 * Returns null on any failure — the map simply skips the point.
 */
export async function geocodeCity(
  countryCode: string,
  city: string | null
): Promise<GeoPoint | null> {
  try {
    const params = new URLSearchParams({
      format: "jsonv2",
      limit: "1",
      country: countryName(countryCode) ?? countryCode,
    });
    if (city && city.trim()) params.set("city", city.trim());

    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: {
        "User-Agent": "themillionairesdollar.com (curators@themillionairesdollar.com)",
      },
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (!res.ok) return null;

    const results = (await res.json()) as Array<{ lat: string; lon: string }>;
    const first = results[0];
    if (!first) return null;

    return jitter(parseFloat(first.lat), parseFloat(first.lon));
  } catch {
    return null;
  }
}

/** ±5km of jitter. 1° latitude ≈ 111km; longitude shrinks with cos(lat). */
export function jitter(lat: number, lon: number): GeoPoint {
  const km = 5;
  const dLat = ((Math.random() * 2 - 1) * km) / 111;
  const cosLat = Math.max(0.1, Math.cos((lat * Math.PI) / 180));
  const dLon = ((Math.random() * 2 - 1) * km) / (111 * cosLat);
  return {
    latitude: Math.round((lat + dLat) * 1e7) / 1e7,
    longitude: Math.round((lon + dLon) * 1e7) / 1e7,
  };
}
