"use server";

import { getServerSupabase } from "@/app/lib/supabase-server";

export interface MapShapeRow {
  id: string;
  name: string | null;
  type: string;
  center_lng: number;
  center_lat: number;
  width_m: number;
  depth_m: number | null;
  height_m: number;
  rotation: number;
  color: string | null;
  locked: boolean;
  published: boolean;
  /** [[lng,lat],[lng,lat]] — only set for type 'road' | 'bridge'; null for buildings. */
  points: [number, number][] | null;
}

export async function getPublishedShapes(): Promise<MapShapeRow[]> {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("map_shapes")
    .select("*")
    .eq("published", true)
    .abortSignal(AbortSignal.timeout(3000));

  if (error) throw new Error(error.message);
  return data ?? [];
}
