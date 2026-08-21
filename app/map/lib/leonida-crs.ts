export const MAP_WIDTH_PX = 2590;

export const MAP_HEIGHT_PX = 3240;

export const LEONIDA_BOUNDS = {
  west: 0,
  south: 0,
  east: 1.0,
  north: 1.251004, // 3240 / 2590
};

// MapLibre's fill-extrusion-height is real mercator meters, but LEONIDA_BOUNDS
// spans ~1 degree (~111km at the equator) to fit the image aspect ratio, so a
// realistic building height renders as an invisibly thin slab. This multiplies
// fill-extrusion-height to compensate; tune visually, doesn't need to be exact.
export const HEIGHT_EXAGGERATION = 8;

export type Coordinate = [number, number];

/**
 * Returns the 4 corner coordinates for a raster layer,
 * ordered: top-left, top-right, bottom-right, bottom-left.
 */
export function getRasterCorners(): [[number, number], [number, number], [number, number], [number, number]] {
  return [
    [LEONIDA_BOUNDS.west, LEONIDA_BOUNDS.north], // top-left
    [LEONIDA_BOUNDS.east, LEONIDA_BOUNDS.north], // top-right
    [LEONIDA_BOUNDS.east, LEONIDA_BOUNDS.south], // bottom-right
    [LEONIDA_BOUNDS.west, LEONIDA_BOUNDS.south], // bottom-left
  ];
}

// Building width/depth are authored in meters but the map's ground plane is
// the fictional LEONIDA_BOUNDS degree space, not real earth geography — so
// convert using the image's pixel scale, not real-world meters-per-degree.
export function metersToLngDegrees(meters: number): number {
  return meters / MAP_WIDTH_PX;
}

export function metersToLatDegrees(meters: number): number {
  return meters / MAP_HEIGHT_PX;
}

// Rounded-rectangle building footprint (Apple Maps-style soft corners) — no
// 3D model / dependency, just more points on the same fill-extrusion polygon.
// Corner arcs are built directly in the same (anisotropic) lng/lat
// half-extent space as the old sharp-corner boxes, and rotated the exact
// same way (plain cos/sin on that space) — doing the rotation in isotropic
// meter-space first and converting per-axis afterward looks correct at
// rotation 0 but shears at any other angle, since scale and rotate don't
// commute when the two axes scale differently (MAP_WIDTH_PX vs MAP_HEIGHT_PX).
const BUILDING_CORNER_SEGMENTS = 6;

/**
 * Builds a closed rounded-rectangle polygon ring (world coords) from a
 * center point, width/depth in meters, and rotation in degrees. Used to
 * generate building footprints for both editing (studio) and static
 * rendering (map).
 */
export function buildRoundedBoxRing(
  center: Coordinate,
  widthM: number,
  depthM: number,
  rotationDeg: number
): Coordinate[] {
  const hw = metersToLngDegrees(widthM) / 2;
  const hd = metersToLatDegrees(depthM) / 2;
  const rM = Math.min(widthM, depthM) * 0.22;
  const rx = Math.min(metersToLngDegrees(rM), metersToLngDegrees(6), hw);
  const ry = Math.min(metersToLatDegrees(rM), metersToLatDegrees(6), hd);
  const rad = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const corners = [
    { cx: hw - rx, cy: hd - ry, a0: 0, a1: Math.PI / 2 },
    { cx: -(hw - rx), cy: hd - ry, a0: Math.PI / 2, a1: Math.PI },
    { cx: -(hw - rx), cy: -(hd - ry), a0: Math.PI, a1: 1.5 * Math.PI },
    { cx: hw - rx, cy: -(hd - ry), a0: 1.5 * Math.PI, a1: 2 * Math.PI },
  ];

  const ring: Coordinate[] = [];
  corners.forEach(({ cx: ccx, cy: ccy, a0, a1 }) => {
    for (let s = 0; s <= BUILDING_CORNER_SEGMENTS; s++) {
      const t = a0 + (a1 - a0) * (s / BUILDING_CORNER_SEGMENTS);
      const px = ccx + rx * Math.cos(t);
      const py = ccy + ry * Math.sin(t);
      ring.push([center[0] + px * cos - py * sin, center[1] + px * sin + py * cos]);
    }
  });

  return [...ring, ring[0]];
}

/**
 * Buffers a straight two-point segment into a rectangular strip polygon
 * (closed ring) of the given width — used for roads and bridges. Direction
 * is computed in meter-space (not raw degrees), since lng/lat use different
 * meters-per-degree divisors in this fictional CRS.
 */
export function bufferLineRing(points: [Coordinate, Coordinate], widthM: number): Coordinate[] {
  const [p0, p1] = points;
  const dxM = (p1[0] - p0[0]) * MAP_WIDTH_PX;
  const dyM = (p1[1] - p0[1]) * MAP_HEIGHT_PX;
  const len = Math.hypot(dxM, dyM) || 1;
  const nxM = -dyM / len;
  const nyM = dxM / len;
  const hw = widthM / 2;
  const offLng = (nxM * hw) / MAP_WIDTH_PX;
  const offLat = (nyM * hw) / MAP_HEIGHT_PX;

  const ring: Coordinate[] = [
    [p0[0] + offLng, p0[1] + offLat],
    [p1[0] + offLng, p1[1] + offLat],
    [p1[0] - offLng, p1[1] - offLat],
    [p0[0] - offLng, p0[1] - offLat],
  ];
  return [...ring, ring[0]];
}
