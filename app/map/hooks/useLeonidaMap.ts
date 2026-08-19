"use client";

import { useEffect, useRef, useCallback } from "react";
import { Map, NavigationControl, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { LEONIDA_BOUNDS, getRasterCorners } from "../lib/leonida-crs";

// DIAGNOSTIC: Complete style with glyphs (required for symbol layers, good practice for all)
const BASE_STYLE: StyleSpecification = {
  version: 8,
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: {},
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": "#0a0e14" },
    },
  ],
};

// Pad bounds 35% beyond LEONIDA_BOUNDS for high-pitch camera clearance
function getPaddedBounds(): [[number, number], [number, number]] {
  const w = LEONIDA_BOUNDS.east - LEONIDA_BOUNDS.west;
  const h = LEONIDA_BOUNDS.north - LEONIDA_BOUNDS.south;
  const padW = w * 0.35;
  const padH = h * 0.35;
  return [
    [LEONIDA_BOUNDS.west - padW, LEONIDA_BOUNDS.south - padH],
    [LEONIDA_BOUNDS.east + padW, LEONIDA_BOUNDS.north + padH],
  ];
}

export interface UseLeonidaMapOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  rasterOpacity: number;
  showRaster: boolean;
  onMapReady?: (map: Map) => void;
}

export interface UseLeonidaMapReturn {
  map: Map | null;
  flyToPitch60: () => void;
}

export function useLeonidaMap({
  containerRef,
  rasterOpacity,
  showRaster,
  onMapReady,
}: UseLeonidaMapOptions): UseLeonidaMapReturn {
  const mapRef = useRef<Map | null>(null);
  const onMapReadyRef = useRef(onMapReady);
  onMapReadyRef.current = onMapReady;

  const flyToPitch60 = useCallback(() => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      mapRef.current.flyTo({
        center: [center.lng, center.lat],
        zoom: mapRef.current.getZoom(),
        pitch: 60,
        bearing: mapRef.current.getBearing(),
        duration: 1000,
      });
    }
  }, []);

  // Init map ONCE — empty deps, ref guard is the only guard
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    // DIAGNOSTIC: Log the style being passed
    console.log("STYLE OBJECT", JSON.stringify(BASE_STYLE, null, 2));

    const map = new Map({
      container: containerRef.current,
      style: BASE_STYLE,
      renderWorldCopies: false,
      maxBounds: getPaddedBounds(),
      maxPitch: 75,
      minZoom: 8,
      maxZoom: 18,
    });

    mapRef.current = map;

    // DIAGNOSTIC: Error handler FIRST
    map.on("error", (e: unknown) => {
      console.error("MAPLIBRE ERROR", e);
    });

    // DIAGNOSTIC: Canvas check
    console.log("CANVAS DIMENSIONS", map.getCanvas().width, map.getCanvas().height);

    // DIAGNOSTIC: WebGL check
    console.log(
      "WEBGL",
      !!map.painter,
      map.getCanvas().getContext("webgl2") ? "webgl2 OK" : "webgl2 FAIL"
    );

    map.addControl(new NavigationControl({ visualizePitch: true }), "bottom-right");

    map.on("load", () => {
      console.log("STYLE LOADED");

      // DIAGNOSTIC: Re-check canvas after load
      console.log("CANVAS AFTER LOAD", map.getCanvas().width, map.getCanvas().height);

      // Fit bounds
      map.fitBounds(
        [
          [LEONIDA_BOUNDS.west, LEONIDA_BOUNDS.south],
          [LEONIDA_BOUNDS.east, LEONIDA_BOUNDS.north],
        ],
        { padding: 20 }
      );

      // DIAGNOSTIC: Test magenta block with try/catch
      console.log("ADDING TEST BLOCK SOURCE...");
      try {
        map.addSource("test-block", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [[
                [-0.01, 0.01],
                [0.01, 0.01],
                [0.01, -0.01],
                [-0.01, -0.01],
                [-0.01, 0.01],
              ]],
            },
            properties: { height: 2000 },
          },
        });
        console.log("TEST BLOCK SOURCE ADDED OK");
      } catch (err) {
        console.error("TEST BLOCK SOURCE ERROR", err);
      }

      console.log("ADDING TEST BLOCK LAYER...");
      try {
        map.addLayer({
          id: "test-block-3d",
          type: "fill-extrusion",
          source: "test-block",
          paint: {
            "fill-extrusion-color": "#ff00ff",
            "fill-extrusion-height": 2000,
            "fill-extrusion-base": 0,
            "fill-extrusion-opacity": 1,
          },
        });
        console.log("TEST BLOCK LAYER ADDED OK");
      } catch (err) {
        console.error("TEST BLOCK LAYER ERROR", err);
      }

      // DIAGNOSTIC: Verify test block
      console.log("TEST BLOCK LAYER:", map.getLayer("test-block-3d"));
      console.log("TEST BLOCK SOURCE:", (map.getSource("test-block") as { _data?: unknown })?._data);
      console.log(
        "TEST BLOCK FEATURES RENDERED:",
        map.queryRenderedFeatures({ layers: ["test-block-3d"] }).length
      );

      // Raster base layer
      console.log("ADDING RASTER SOURCE...");
      try {
        const corners = getRasterCorners();
        map.addSource("leonida-base", {
          type: "image",
          url: "/map/leonida-base.jpg",
          coordinates: corners,
        });
        console.log("RASTER SOURCE ADDED OK");
      } catch (err) {
        console.error("RASTER SOURCE ERROR", err);
      }

      console.log("ADDING RASTER LAYER...");
      try {
        map.addLayer({
          id: "leonida-base-layer",
          type: "raster",
          source: "leonida-base",
          paint: {
            "raster-opacity": rasterOpacity / 100,
          },
        });
        console.log("RASTER LAYER ADDED OK");
      } catch (err) {
        console.error("RASTER LAYER ERROR", err);
      }

      map.resize();
      onMapReadyRef.current?.(map);
    });

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Init runs once

  // Update raster opacity
  useEffect(() => {
    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      mapRef.current.setPaintProperty("leonida-base-layer", "raster-opacity", rasterOpacity / 100);
    }
  }, [rasterOpacity]);

  // Toggle raster visibility
  useEffect(() => {
    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      mapRef.current.setLayoutProperty("leonida-base-layer", "visibility", showRaster ? "visible" : "none");
    }
  }, [showRaster]);

  return { map: mapRef.current, flyToPitch60 };
}
