"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/i18n";
import { countryName } from "@/lib/countries";
import { formatTileNumber } from "@/lib/utils";
import mapStyle from "@/lib/mapbox/style.dark.json";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapPointProps {
  dict: Dict;
  /** "preview" = framed 16:9/4:3 block · "full" = fills its parent. */
  variant: "preview" | "full";
}

interface GeoFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: { tile_number: number; name: string; country: string; year: number | null; tier: string };
}

/**
 * Mapbox GL world map of declarations. The SDK is imported dynamically so it
 * only loads when this component mounts (the parents gate mounting on
 * viewport intersection). Points are clustered server data via /api/map-data.
 */
export function WorldMap({ dict, variant }: MapPointProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !containerRef.current) {
      setFailed(true);
      return;
    }

    let map: import("mapbox-gl").Map | null = null;
    let cancelled = false;

    (async () => {
      const [{ default: mapboxgl }, dataRes] = await Promise.all([
        import("mapbox-gl"),
        fetch("/api/map-data").then((r) => r.json()) as Promise<{
          type: "FeatureCollection";
          features: GeoFeature[];
        }>,
      ]);
      if (cancelled || !containerRef.current) return;

      mapboxgl.accessToken = token;
      setCount(dataRes.features.length);

      map = new mapboxgl.Map({
        container: containerRef.current,
        style: mapStyle as unknown as import("mapbox-gl").StyleSpecification,
        center: [8, 30],
        zoom: 1.2,
        minZoom: 1,
        maxZoom: 10,
        cooperativeGestures: variant === "preview",
      });

      // Self-diagnosis: failed styles/tiles/glyphs would otherwise render as
      // a silent black rectangle. Surface the first error on screen + console.
      map.on("error", (e) => {
        const message = e.error?.message ?? "unknown map error";
        console.error("[M.D. map]", message);
        setMapError((prev) => prev ?? message);
      });

      map.on("load", () => {
        if (!map) return;
        map.addSource("declarations", {
          type: "geojson",
          data: dataRes,
          cluster: true,
          clusterRadius: 50,
          clusterMaxZoom: 9,
        });

        // Soft glow underneath each point.
        map.addLayer({
          id: "point-glow",
          type: "circle",
          source: "declarations",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#8b7355",
            "circle-radius": 10,
            "circle-opacity": 0.35,
            "circle-blur": 1,
          },
        });
        map.addLayer({
          id: "point",
          type: "circle",
          source: "declarations",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#8b7355",
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 3, 8, 5],
            "circle-opacity": 0.9,
          },
        });
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "declarations",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#1c1c1c",
            "circle-stroke-color": "#8b7355",
            "circle-stroke-width": 1.5,
            "circle-radius": ["step", ["get", "point_count"], 14, 50, 20, 500, 28],
          },
        });
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "declarations",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["DIN Pro Regular", "Arial Unicode MS Regular"],
            "text-size": 11,
          },
          paint: { "text-color": "#c9a876" },
        });

        map.on("click", "clusters", (e) => {
          const feature = map!.queryRenderedFeatures(e.point, { layers: ["clusters"] })[0];
          if (!feature) return;
          const clusterId = feature.properties?.cluster_id as number;
          const source = map!.getSource("declarations") as import("mapbox-gl").GeoJSONSource;
          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err || zoom == null) return;
            map!.easeTo({
              center: (feature.geometry as GeoJSON.Point).coordinates as [number, number],
              zoom: Math.min(zoom, 10),
            });
          });
        });

        map.on("click", "point", (e) => {
          const feature = e.features?.[0];
          if (!feature) return;
          const p = feature.properties as GeoFeature["properties"];
          const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
          new mapboxgl.Popup({ closeButton: true, offset: 10 })
            .setLngLat(coords)
            .setHTML(
              `<div>${formatTileNumber(Number(p.tile_number))}<br/>${p.name}<br/>${
                countryName(p.country) ?? p.country
              }${p.year ? ` — ${p.year}` : ""}</div>`
            )
            .addTo(map!);
        });

        for (const layer of ["point", "clusters"]) {
          map.on("mouseenter", layer, () => {
            map!.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", layer, () => {
            map!.getCanvas().style.cursor = "";
          });
        }

        // Slow collective pulse (skipped for reduced motion).
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          let t = 0;
          const pulse = setInterval(() => {
            if (!map || !map.getLayer("point")) return;
            t += 0.1;
            const opacity = 0.75 + 0.2 * Math.sin(t);
            map.setPaintProperty("point", "circle-opacity", opacity);
          }, 300);
          map.on("remove", () => clearInterval(pulse));
        }
      });
    })().catch(() => setFailed(true));

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [variant]);

  return (
    <div
      className={
        variant === "full"
          ? "relative h-full w-full"
          : "relative aspect-[4/3] w-full border border-edge sm:aspect-video"
      }
    >
      {/* Land-colored failsafe: if the style can't load, this shows instead of a void. */}
      <div
        ref={containerRef}
        className="absolute inset-0 bg-[#1a1a1a]"
        aria-label="World map of declarations"
        role="img"
      />
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-elevated">
          <p className="px-8 text-center font-mono text-xs uppercase tracking-[0.2em] text-tertiary">
            Map unavailable — NEXT_PUBLIC_MAPBOX_TOKEN not configured
          </p>
        </div>
      )}
      {mapError && (
        <p className="absolute left-3 top-3 max-w-[80%] truncate bg-bg/80 px-3 py-1.5 font-mono text-[10px] text-danger">
          map error: {mapError}
        </p>
      )}
      {variant === "preview" && count !== null && (
        <p className="absolute right-3 top-3 bg-bg/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-secondary">
          {count.toLocaleString()} {dict.map.declarations}
        </p>
      )}
      <p className="absolute bottom-3 left-3 flex items-center gap-2 bg-bg/70 px-3 py-1.5 font-mono text-[10px] text-tertiary">
        <span aria-hidden="true" className="inline-block h-[5px] w-[5px] rounded-full bg-accent" />
        {dict.map.legend}
      </p>
    </div>
  );
}
