"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/i18n";
import { countryName } from "@/lib/countries";
import { formatTileNumber } from "@/lib/utils";
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
    let resizeObserver: ResizeObserver | null = null;

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
        // Standard dark style: guaranteed to render with any valid token.
        // Recolored to the M.D. palette and stripped of roads/POIs on load
        // (see "style.load" below). The hand-built minimal style is kept in
        // lib/mapbox/style.dark.json for reference.
        style: "mapbox://styles/mapbox/dark-v11",
        center: [8, 30],
        zoom: 1.4,
        minZoom: 1,
        maxZoom: 10,
        cooperativeGestures: variant === "preview",
      });

      // Apply the editorial palette over the standard style: water #0a0a0a,
      // flat land #1a1a1a, thin country borders, country labels only (z3+).
      // Layer ids vary between style versions, so match by type/pattern and
      // never reference a hardcoded id (the previous "background" id did not
      // exist in dark-v11 and raised a style error).
      map.on("style.load", () => {
        if (!map) return;
        for (const layer of map.getStyle()?.layers ?? []) {
          const id = layer.id;
          try {
            if (layer.type === "background") {
              map.setPaintProperty(id, "background-color", "#1a1a1a");
            } else if (layer.type === "fill" && /water|ocean|sea/i.test(id)) {
              map.setPaintProperty(id, "fill-color", "#0a0a0a");
            } else if (id === "country-label") {
              map.setPaintProperty(id, "text-color", "#6b6862");
              map.setPaintProperty(id, "text-halo-color", "#0a0a0a");
              map.setLayerZoomRange(id, 3, 24);
            } else if (layer.type === "symbol") {
              // No cities, no road names, no POIs — only countries remain.
              map.setLayoutProperty(id, "visibility", "none");
            } else if (layer.type === "line" && /^admin-0-boundary$/.test(id)) {
              map.setPaintProperty(id, "line-color", "#2a2a2a");
              map.setPaintProperty(id, "line-width", 0.5);
            } else if (layer.type === "fill" || layer.type === "line" || layer.type === "hillshade" || layer.type === "fill-extrusion") {
              // Landuse, parks, roads, admin-1, waterways, terrain: flat dark.
              map.setLayoutProperty(id, "visibility", "none");
            }
          } catch {
            // Never let a single cosmetic tweak break the whole map.
          }
        }
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

        // The aspect-ratio container settles its height AFTER the map is
        // constructed, so the initial measurement is a thin strip (e.g.
        // 1092x269) and the world is squashed off-screen. A ResizeObserver
        // re-syncs the GL viewport to the container on every layout change —
        // the canonical fix for a blank/clipped Mapbox canvas.
        map.resize();
        if (containerRef.current) {
          resizeObserver = new ResizeObserver(() => map?.resize());
          resizeObserver.observe(containerRef.current);
        }

        const canvas = map.getCanvas();
        console.info(
          `[M.D. map] loaded — canvas ${canvas.width}x${canvas.height}, zoom ${map
            .getZoom()
            .toFixed(2)}`
        );
        map.once("idle", () => {
          if (!map) return;
          console.info(
            `[M.D. map] idle — tiles loaded: ${map.areTilesLoaded()}, canvas ${
              map.getCanvas().width
            }x${map.getCanvas().height}`
          );
        });

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
            "circle-color": "#c9a876",
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 5, 8, 7],
            "circle-stroke-color": "#8b7355",
            "circle-stroke-width": 1,
            "circle-opacity": 1,
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
      resizeObserver?.disconnect();
      map?.remove();
    };
  }, [variant]);

  return (
    <div
      className={
        variant === "full"
          ? "relative h-full min-h-[400px] w-full"
          : "relative h-[480px] w-full border border-edge sm:h-[600px]"
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
