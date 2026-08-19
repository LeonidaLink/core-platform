"use client";

import { useEffect, useRef, useState, useCallback, SetStateAction } from "react";
import { Map, MapMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Eye,
  EyeOff,
  RotateCcw,
  Trash2,
  Copy,
  Download,
  Box,
  CopyCheck,
  Square,
  Pentagon,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import { LEONIDA_BOUNDS, getRasterCorners } from "@/app/map/lib/leonida-crs";

const COLORS = {
  block: "#D4A574",
  tower: "#FF69B4",
  water: "#0DB9FF",
  park: "#3D8B37",
  district: "#9370DB",
  road: "#E8D5B7",
  drawing: "#C7E0F5",
  selection: "#FFFFFF",
};

export type ShapeType = "block" | "tower" | "water" | "park" | "district" | "road";

export interface BoxShape {
  id: string;
  name: string;
  type: ShapeType;
  height: number;
  center: [number, number];
  width: number;
  depth: number;
  rotation: number;
  createdAt: number;
}

const SHAPE_TYPES = [
  { value: "block" as ShapeType, label: "Block", color: COLORS.block },
  { value: "tower" as ShapeType, label: "Tower", color: COLORS.tower },
  { value: "water" as ShapeType, label: "Water", color: COLORS.water },
  { value: "park" as ShapeType, label: "Park", color: COLORS.park },
  { value: "district" as ShapeType, label: "District", color: COLORS.district },
  { value: "road" as ShapeType, label: "Road", color: COLORS.road },
];

const STORAGE_KEY = "leonida-studio-shapes";
const WIP_KEY = "leonida-studio-wip-box";
const STUDIO_OPEN = process.env.NEXT_PUBLIC_STUDIO_OPEN === "true";

// CRS: 2590m wide, 3240m tall
function mToLng(m: number) { return m / 2590; }
function mToLat(m: number) { return m / 3240; }

function boxToGeoJSON(shape: BoxShape) {
  const hw = mToLng(shape.width) / 2;
  const hd = mToLat(shape.depth) / 2;
  const rad = (shape.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const corners: [number, number][] = [
    [-hw, hd], [hw, hd], [hw, -hd], [-hw, -hd],
  ].map(([x, y]) => [
    shape.center[0] + x * cos - y * sin,
    shape.center[1] + x * sin + y * cos,
  ]);

  return {
    type: "Feature" as const,
    id: shape.id,
    geometry: {
      type: "Polygon" as const,
      coordinates: [[...corners, corners[0]]],
    },
    properties: {
      id: shape.id,
      name: shape.name,
      type: shape.type,
      height: shape.height,
    },
  };
}

const SHAPE_SOURCE_ID = "shapes-source";
const SHAPE_LAYER_ID = "shapes-fill";
const SHAPE_LINE_ID = "shapes-line";
const PREVIEW_SOURCE_ID = "preview-source";
const PREVIEW_LAYER_ID = "preview-fill";

export default function StudioMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [session, setSession] = useState<unknown>(null);
  const [showRaster, setShowRaster] = useState(true);
  const [rasterOpacity, setRasterOpacity] = useState(100);
  const [isPitch60, setIsPitch60] = useState(false);

  const [isPlacing, setIsPlacing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shapes, setShapes] = useState<BoxShape[]>([]);

  // Box defaults
  const [boxName, setBoxName] = useState("");
  const [boxType, setBoxType] = useState<ShapeType>("block");
  const [boxWidth, setBoxWidth] = useState(50);
  const [boxDepth, setBoxDepth] = useState(50);
  const [boxHeight, setBoxHeight] = useState(30);
  const [boxRotation, setBoxRotation] = useState(0);

  const [copied, setCopied] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setShapes(JSON.parse(saved));
      const wip = localStorage.getItem(WIP_KEY);
      if (wip) {
        const d = JSON.parse(wip);
        setBoxWidth(d.width || 50);
        setBoxDepth(d.depth || 50);
        setBoxHeight(d.height || 30);
        setBoxRotation(d.rotation || 0);
        setBoxType(d.type || "block");
      }
    } catch {}
  }, []);

  // Save shapes
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(shapes)); } catch {}
  }, [shapes]);

  // Save defaults
  useEffect(() => {
    try {
      localStorage.setItem(WIP_KEY, JSON.stringify({ width: boxWidth, depth: boxDepth, height: boxHeight, rotation: boxRotation, type: boxType }));
    } catch {}
  }, [boxWidth, boxDepth, boxHeight, boxRotation, boxType]);

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session as SetStateAction<unknown>));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session as SetStateAction<unknown>));
    return () => subscription.unsubscribe();
  }, []);

  // Init map
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = new Map({
      container: containerRef.current,
      style: {
        version: 8,
        glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
        sources: {},
        layers: [{ id: "bg", type: "background", paint: { "background-color": "#0a0e14" } }],
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

      // Raster
      try {
        map.addSource("raster", { type: "image", url: "/map/leonida-base.jpg", coordinates: getRasterCorners() });
        map.addLayer({ id: "raster-layer", type: "raster", source: "raster", paint: { "raster-opacity": 1 } });
      } catch (e) { console.error("[RASTER]", e); }

      map.resize();
    });

    map.on("pitch", () => setIsPitch60(Math.round(map.getPitch()) === 60));

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(containerRef.current);

    return () => { ro.disconnect(); map.remove(); mapRef.current = null; };
  }, []);

  // Raster opacity toggle
  useEffect(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;
    if (showRaster) {
      mapRef.current.setLayoutProperty("raster-layer", "visibility", "visible");
      mapRef.current.setPaintProperty("raster-layer", "raster-opacity", rasterOpacity / 100);
    } else {
      mapRef.current.setLayoutProperty("raster-layer", "visibility", "none");
    }
  }, [showRaster, rasterOpacity]);

  // Render shapes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    // Remove old
    [SHAPE_LAYER_ID, SHAPE_LINE_ID, PREVIEW_LAYER_ID].forEach(id => { if (map.getLayer(id)) map.removeLayer(id); });
    [SHAPE_SOURCE_ID, PREVIEW_SOURCE_ID].forEach(id => { if (map.getSource(id)) map.removeSource(id); });

    if (shapes.length === 0) return;

    const fc = { type: "FeatureCollection" as const, features: shapes.map(boxToGeoJSON) };

    map.addSource(SHAPE_SOURCE_ID, { type: "geojson", data: fc });

    map.addLayer({
      id: SHAPE_LAYER_ID,
      type: "fill-extrusion",
      source: SHAPE_SOURCE_ID,
      paint: {
        "fill-extrusion-color": [
          "case",
          ["==", ["get", "id"], selectedId || ""],
          COLORS.selection,
          ["match", ["get", "type"],
            "block", COLORS.block,
            "tower", COLORS.tower,
            "water", COLORS.water,
            "park", COLORS.park,
            "district", COLORS.district,
            "road", COLORS.road,
            COLORS.block,
          ],
        ],
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-base": 0,
        "fill-extrusion-opacity": 0.85,
      },
    });

    map.addLayer({
      id: SHAPE_LINE_ID,
      type: "line",
      source: SHAPE_SOURCE_ID,
      paint: { "line-color": "#ffffff", "line-width": 1, "line-opacity": 0.4 },
    });
  }, [shapes, selectedId]);

  // Preview while placing
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !isPlacing) return;

    if (map.getSource(PREVIEW_SOURCE_ID)) map.removeSource(PREVIEW_SOURCE_ID);
    if (map.getLayer(PREVIEW_LAYER_ID)) map.removeLayer(PREVIEW_LAYER_ID);

    const center = map.getCenter();
    const hw = mToLng(boxWidth) / 2;
    const hd = mToLat(boxDepth) / 2;
    const rad = (boxRotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const corners: [number, number][] = [[-hw, hd], [hw, hd], [hw, -hd], [-hw, -hd]]
      .map(([x, y]) => [center.lng + x * cos - y * sin, center.lat + x * sin + y * cos]);

    map.addSource(PREVIEW_SOURCE_ID, {
      type: "geojson",
      data: { type: "Feature", geometry: { type: "Polygon", coordinates: [[...corners, corners[0]]] }, properties: {} },
    });

    map.addLayer({ id: PREVIEW_LAYER_ID, type: "fill", source: PREVIEW_SOURCE_ID, paint: { "fill-color": COLORS.drawing, "fill-opacity": 0.4 } });
  }, [isPlacing, boxWidth, boxDepth, boxRotation]);

  // Place box on click
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handler = (e: MapMouseEvent) => {
      if (!isPlacing) return;
      const newShape: BoxShape = {
        id: crypto.randomUUID(),
        name: boxName.trim() || `Box ${Date.now() % 10000}`,
        type: boxType,
        height: boxHeight,
        center: [e.lngLat.lng, e.lngLat.lat],
        width: boxWidth,
        depth: boxDepth,
        rotation: boxRotation,
        createdAt: Date.now(),
      };
      setShapes(prev => [...prev, newShape]);
      setSelectedId(newShape.id);
      setIsPlacing(false);
      setBoxName("");
      map.flyTo({ pitch: 0, duration: 500 });
    };

    map.on("click", handler);
    return () => { map.off("click", handler); };
  }, [isPlacing, boxName, boxType, boxWidth, boxDepth, boxHeight, boxRotation]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "SELECT") return;

      if (e.key === "Escape" && isPlacing) {
        setIsPlacing(false);
        return;
      }

      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        setShapes(prev => prev.filter(s => s.id !== selectedId));
        setSelectedId(null);
        return;
      }

      if (!selectedId) return;
      const shape = shapes.find(s => s.id === selectedId);
      if (!shape) return;

      const step = e.shiftKey ? 10 : 1;
      let dx = 0, dy = 0;
      if (e.key === "ArrowLeft") dx = -step;
      else if (e.key === "ArrowRight") dx = step;
      else if (e.key === "ArrowUp") dy = step;
      else if (e.key === "ArrowDown") dy = -step;
      else return;

      e.preventDefault();
      setShapes(prev => prev.map(s =>
        s.id === selectedId
          ? { ...s, center: [s.center[0] + mToLng(dx), s.center[1] + mToLat(dy)] }
          : s
      ));
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isPlacing, selectedId, shapes]);

  const deleteShape = (id: string) => {
    setShapes(prev => prev.filter(s => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const copyGeoJSON = () => {
    const fc = { type: "FeatureCollection" as const, features: shapes.map(boxToGeoJSON) };
    navigator.clipboard.writeText(JSON.stringify(fc, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadGeoJSON = () => {
    const fc = { type: "FeatureCollection" as const, features: shapes.map(boxToGeoJSON) };
    const blob = new Blob([JSON.stringify(fc, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "leonida-shapes.geojson"; a.click();
    URL.revokeObjectURL(url);
  };

  const signIn = () => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href } });

  if (!STUDIO_OPEN && !session) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0e14]">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center max-w-md">
          <img src="/brand/logo.png" alt="Leonida Link" className="h-12 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-white mb-3">Map Studio</h2>
          <p className="text-white/60 mb-6 font-semibold">Sign in to access the tracing studio.</p>
          <button onClick={signIn} className="flex items-center justify-center gap-2 bg-[#C7E0F5] hover:bg-[#A5C4D8] text-[#112A46] w-full px-6 py-3 rounded-full font-extrabold transition">
            Sign in with Google
          </button>
          <Link href="/map" className="block mt-4 text-white/40 hover:text-white text-sm font-semibold">Back to Map</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />

      {/* HUD */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
          <img src="/brand/logo.png" alt="Leonida Link" className="h-8 mb-3" />
          <p className="text-white/60 text-xs mb-3">{isPlacing ? "Click to place box" : "Click Place Box to begin"}</p>
          <div className="flex flex-col gap-2">
            <Link href="/map" className="flex items-center gap-2 text-[#C7E0F5] hover:text-white text-sm font-extrabold">
              <RotateCcw size={16} /> Back
            </Link>
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

      {/* Sidebar */}
      <div className="absolute top-4 right-4 z-10 w-72">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 max-h-[calc(100vh-2rem)] overflow-y-auto">
          <h3 className="text-lg font-black text-white mb-4">Tracing Studio</h3>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="text-white/60 text-xs font-semibold mb-1 block">Width (m)</label>
              <input type="number" value={boxWidth} onChange={e => setBoxWidth(Number(e.target.value))} min="1" className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#7969EE]" />
            </div>
            <div>
              <label className="text-white/60 text-xs font-semibold mb-1 block">Depth (m)</label>
              <input type="number" value={boxDepth} onChange={e => setBoxDepth(Number(e.target.value))} min="1" className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#7969EE]" />
            </div>
            <div>
              <label className="text-white/60 text-xs font-semibold mb-1 block">Height (m)</label>
              <input type="number" value={boxHeight} onChange={e => setBoxHeight(Number(e.target.value))} min="1" className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#7969EE]" />
            </div>
            <div>
              <label className="text-white/60 text-xs font-semibold mb-1 block">Rotation (°)</label>
              <input type="number" value={boxRotation} onChange={e => setBoxRotation(Number(e.target.value))} className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#7969EE]" />
            </div>
          </div>

          {/* Name & Type */}
          <div className="space-y-3 mb-4 pb-4 border-b border-white/10">
            <input type="text" value={boxName} onChange={e => setBoxName(e.target.value)} placeholder="Name (optional)" className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#7969EE]" />
            <select value={boxType} onChange={e => setBoxType(e.target.value as ShapeType)} className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#7969EE]">
              {SHAPE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          {/* Place button */}
          {!isPlacing ? (
            <button onClick={() => { setIsPlacing(true); mapRef.current?.flyTo({ pitch: 0, duration: 500 }); }} className="flex items-center justify-center gap-2 bg-[#7969EE] hover:bg-[#6a5ad4] text-white w-full px-4 py-3 rounded-xl font-extrabold transition mb-4">
              <Square size={18} /> Place Box
            </button>
          ) : (
            <button onClick={() => setIsPlacing(false)} className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white w-full px-4 py-3 rounded-xl font-extrabold transition mb-4">
              Cancel
            </button>
          )}

          {/* Edit selected */}
          {selectedId && (() => {
            const sel = shapes.find(s => s.id === selectedId);
            if (!sel) return null;
            return (
              <div className="mb-4 pb-4 border-b border-white/10">
                <h4 className="text-white/60 text-xs font-semibold mb-2 uppercase">Editing: {sel.name}</h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-white/60 text-xs font-semibold mb-1 block">Height (m)</label>
                    <input type="number" value={sel.height} onChange={e => setShapes(prev => prev.map(s => s.id === selectedId ? { ...s, height: Number(e.target.value) } : s))} className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#7969EE]" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-white/60 text-xs font-semibold mb-1 block">Width</label>
                      <input type="number" value={sel.width} onChange={e => setShapes(prev => prev.map(s => s.id === selectedId ? { ...s, width: Number(e.target.value) } : s))} className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#7969EE]" />
                    </div>
                    <div>
                      <label className="text-white/60 text-xs font-semibold mb-1 block">Depth</label>
                      <input type="number" value={sel.depth} onChange={e => setShapes(prev => prev.map(s => s.id === selectedId ? { ...s, depth: Number(e.target.value) } : s))} className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#7969EE]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs font-semibold mb-1 block">Rotation</label>
                    <input type="number" value={sel.rotation} onChange={e => setShapes(prev => prev.map(s => s.id === selectedId ? { ...s, rotation: Number(e.target.value) } : s))} className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#7969EE]" />
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Shapes list */}
          <div className="mb-4">
            <h4 className="text-white/60 text-xs font-semibold mb-2 uppercase">Shapes ({shapes.length})</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {shapes.length === 0 ? (
                <p className="text-white/30 text-sm italic">No shapes yet</p>
              ) : shapes.map(shape => {
                const typeInfo = SHAPE_TYPES.find(t => t.value === shape.type);
                return (
                  <div key={shape.id} onClick={() => setSelectedId(selectedId === shape.id ? null : shape.id)} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${selectedId === shape.id ? "bg-white/10" : "hover:bg-white/5"}`}>
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: typeInfo?.color }} />
                    <span className="text-white text-sm font-semibold truncate flex-1">{shape.name}</span>
                    <button onClick={e => { e.stopPropagation(); deleteShape(shape.id); }} className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-red-400 transition shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export */}
          <div className="flex gap-2">
            <button onClick={copyGeoJSON} disabled={shapes.length === 0} className={`flex-1 flex items-center justify-center gap-1 text-white px-3 py-2 rounded-lg font-semibold transition text-xs ${shapes.length === 0 ? "bg-white/10 opacity-50 cursor-not-allowed" : copied ? "bg-green-600" : "bg-white/10 hover:bg-white/20"}`}>
              {copied ? <CopyCheck size={14} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy GeoJSON"}
            </button>
            <button onClick={downloadGeoJSON} disabled={shapes.length === 0} className="flex-1 flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white px-3 py-2 rounded-lg font-semibold transition text-xs">
              <Download size={14} /> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
