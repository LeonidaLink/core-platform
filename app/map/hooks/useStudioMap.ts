"use client";

import { useEffect, useRef, useCallback } from "react";
import { Map, NavigationControl, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { LEONIDA_BOUNDS, getRasterCorners } from "../lib/leonida-crs";

// Style with glyphs for symbol layers
const LEONIDA_STYLE = {
  version: 8,
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: {} as Record<string, unknown>,
  layers: [
    {
      id: "background",
      type: "background" as const,
      paint: { "background-color": "#0a0e14" },
    },
  ],
};

function getPaddedBounds(): [[number, number], [number, number]] {
  const w = LEONIDA_BOUNDS.east - LEONIDA_BOUNDS.west;
  const h = LEONIDA_BOUNDS.north - LEONIDA_BOUNDS.south;
  return [
    [LEONIDA_BOUNDS.west - w * 0.4, LEONIDA_BOUNDS.south - h * 0.4],
    [LEONIDA_BOUNDS.east + w * 0.4, LEONIDA_BOUNDS.north + h * 0.4],
  ];
}

export interface StudioMapHandle {
  map: Map | null;
  flyToPitch60: () => void;
  flyToPitch0: () => void;
}

export function useStudioMap(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onReady?: (map: Map) => void
): StudioMapHandle {
  const mapRef = useRef<Map | null>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const flyToPitch60 = useCallback(() => {
    mapRef.current?.flyTo({ pitch: 60, duration: 1000 });
  }, []);

  const flyToPitch0 = useCallback(() => {
    mapRef.current?.flyTo({ pitch: 0, duration: 500 });
  }, []);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = new Map({
      container: containerRef.current,
      style: LEONIDA_STYLE as StyleSpecification,
      renderWorldCopies: false,
      maxBounds: getPaddedBounds(),
      maxPitch: 75,
      minZoom: 8,
      maxZoom: 18,
    });

    mapRef.current = map;

    map.on("error", (e) => {
      console.error("[MAPLIBRE]", e.error?.message || e.error || e);
    });

    map.addControl(new NavigationControl({ visualizePitch: true }), "bottom-right");

    map.on("load", () => {
      map.fitBounds(
        [[LEONIDA_BOUNDS.west, LEONIDA_BOUNDS.south], [LEONIDA_BOUNDS.east, LEONIDA_BOUNDS.north]],
        { padding: 20 }
      );

      // Raster base image
      try {
        map.addSource("leonida-base", {
          type: "image",
          url: "/map/leonida-base.jpg",
          coordinates: getRasterCorners(),
        });
        map.addLayer({
          id: "leonida-base-layer",
          type: "raster",
          source: "leonida-base",
          paint: { "raster-opacity": 1 },
        });
      } catch (e) {
        console.error("[RASTER]", e);
      }

      onReadyRef.current?.(map);
    });

    const ro = new ResizeObserver(() => map.resize());
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, [containerRef]);

  return { map: mapRef.current, flyToPitch60, flyToPitch0 };
}
