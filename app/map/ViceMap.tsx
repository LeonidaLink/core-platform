"use client";

import { useEffect, useRef, useState } from "react";
import { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Eye, EyeOff, RotateCcw, Box } from "lucide-react";
import Link from "next/link";
import { LEONIDA_BOUNDS, getRasterCorners, buildRoundedBoxRing, bufferLineRing, HEIGHT_EXAGGERATION } from "./lib/leonida-crs";
import type { MapShapeRow } from "@/app/actions/mapShapes";

const SHAPE_SOURCE_ID = "published-shapes-source";
const SHAPE_LAYER_ID = "published-shapes-fill";
// Apple Maps-style buildings: one muted blue-gray for every building (roads/
// bridges keep their own asphalt/deck color), shaded by the map's light so
// each face reads with soft depth instead of flat color.
const APPLE_BUILDING_COLOR = "#8791A6";

// Buildings taller than this get a stepped/setback silhouette (a narrower
// upper tier on top of the full-footprint base) instead of a plain prism —
// mirrors the tiered towers in reference Apple/Google Maps 3D renders.
const TALL_BUILDING_HEIGHT_M = 60;
const TIER_HEIGHT_RATIO = 0.62;
const TIER_FOOTPRINT_RATIO = 0.62;

function boxFeature(row: MapShapeRow, widthM: number, depthM: number, base: number, height: number, color: string) {
  const ring = buildRoundedBoxRing([row.center_lng, row.center_lat], widthM, depthM, row.rotation);
  return {
    type: "Feature" as const,
    id: row.id,
    geometry: { type: "Polygon" as const, coordinates: [ring] },
    properties: { color, base, height, type: row.type },
  };
}

function buildingFeatures(row: MapShapeRow) {
  const widthM = row.width_m;
  const depthM = row.depth_m ?? row.width_m;
  const color = row.color ?? APPLE_BUILDING_COLOR;
  if (row.height_m < TALL_BUILDING_HEIGHT_M) {
    return [boxFeature(row, widthM, depthM, 0, row.height_m, color)];
  }
  const baseTierHeight = row.height_m * TIER_HEIGHT_RATIO;
  return [
    boxFeature(row, widthM, depthM, 0, baseTierHeight, color),
    boxFeature(row, widthM * TIER_FOOTPRINT_RATIO, depthM * TIER_FOOTPRINT_RATIO, baseTierHeight, row.height_m, color),
  ];
}

function rowToFeatures(row: MapShapeRow) {
  const isLine = row.type === "road" || row.type === "bridge";
  if (isLine && row.points) {
    const ring = bufferLineRing(row.points as [[number, number], [number, number]], row.width_m);
    return [{
      type: "Feature" as const,
      id: row.id,
      geometry: { type: "Polygon" as const, coordinates: [ring] },
      properties: { color: row.color ?? "#3a3a3a", base: 0, height: row.height_m, type: row.type },
    }];
  }
  return buildingFeatures(row);
}

export default function ViceMap({ shapes = [] }: { shapes?: MapShapeRow[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [showRaster, setShowRaster] = useState(true);
  const [rasterOpacity, setRasterOpacity] = useState(100);
  const [isPitch60, setIsPitch60] = useState(false);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = new Map({
      container: containerRef.current,
      style: {
        version: 8,
        glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
        sources: {},
        layers: [{ id: "bg", type: "background", paint: { "background-color": "#0a0e14" } }],
        light: { anchor: "viewport", color: "#dbe4f0", intensity: 0.45, position: [1.15, 210, 55] },
      },
      renderWorldCopies: false,
      maxBounds: [[-0.5, -0.5], [1.5, 1.8]] as [[number, number], [number, number]],
      maxPitch: 75,
      minZoom: 8,
      maxZoom: 18,
    });

    mapRef.current = map;

    map.on("error", (e) => console.error("[MAPLIBRE]", e.error?.message || e));

    map.on("load", () => {
      map.fitBounds([[LEONIDA_BOUNDS.west, LEONIDA_BOUNDS.south], [LEONIDA_BOUNDS.east, LEONIDA_BOUNDS.north]], { padding: 20 });

      try {
        map.addSource("raster", { type: "image", url: "/map/leonida-base.jpg", coordinates: getRasterCorners() });
        map.addLayer({ id: "raster-layer", type: "raster", source: "raster", paint: { "raster-opacity": 1 } });
      } catch (e) { console.error("[RASTER]", e); }

      if (shapes.length > 0) {
        const fc = { type: "FeatureCollection" as const, features: shapes.flatMap(rowToFeatures) };
        map.addSource(SHAPE_SOURCE_ID, { type: "geojson", data: fc });
        map.addLayer({
          id: SHAPE_LAYER_ID,
          type: "fill-extrusion",
          source: SHAPE_SOURCE_ID,
          minzoom: 0,
          paint: {
            "fill-extrusion-color": [
              "case",
              ["any", ["==", ["get", "type"], "road"], ["==", ["get", "type"], "bridge"]],
              ["get", "color"],
              APPLE_BUILDING_COLOR,
            ],
            "fill-extrusion-height": ["*", ["get", "height"], HEIGHT_EXAGGERATION],
            "fill-extrusion-base": ["*", ["get", "base"], HEIGHT_EXAGGERATION],
            "fill-extrusion-vertical-gradient": true,
            "fill-extrusion-opacity": 0.95,
          },
        });
      }

      map.resize();
    });

    map.on("pitch", () => setIsPitch60(Math.round(map.getPitch()) === 60));

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(containerRef.current);

    return () => { ro.disconnect(); map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;
    if (showRaster) {
      mapRef.current.setLayoutProperty("raster-layer", "visibility", "visible");
      mapRef.current.setPaintProperty("raster-layer", "raster-opacity", rasterOpacity / 100);
    } else {
      mapRef.current.setLayoutProperty("raster-layer", "visibility", "none");
    }
  }, [showRaster, rasterOpacity]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />

      {/* HUD */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
          <img src="/brand/logo.png" alt="Leonida Link" className="h-8 mb-3" />
          <p className="text-white/60 text-xs mb-3">Drag to pan • Scroll to zoom • Two fingers to tilt</p>
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 text-[#C7E0F5] hover:text-white text-sm font-extrabold">
              <RotateCcw size={16} /> Back to Home
            </Link>
            <a href="/studio2.html" target="_blank" className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-extrabold">
              ✏️ Open Studio
            </a>
            <button
              onClick={() => { mapRef.current?.flyTo({ pitch: isPitch60 ? 0 : 60, duration: 1000 }); setIsPitch60(p => !p); }}
              className={`flex items-center gap-2 text-sm font-extrabold ${isPitch60 ? "text-[#7969EE]" : "text-white/60 hover:text-white"}`}
            >
              <Box size={16} /> {isPitch60 ? "Pitch 0°" : "3D View"}
            </button>
          </div>
        </div>
      </div>

      {/* Raster controls */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => setShowRaster(v => !v)} className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition">
              {showRaster ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <span className="text-white/60 text-sm font-semibold">Base Map</span>
          </div>
          <div className="space-y-2">
            <label className="text-white/40 text-xs font-semibold">Opacity</label>
            <input type="range" min="0" max="100" value={rasterOpacity} onChange={e => setRasterOpacity(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg cursor-pointer accent-[#7969EE]" />
            <div className="flex justify-between text-white/40 text-xs"><span>0%</span><span>{rasterOpacity}%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
