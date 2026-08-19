export const MAP_WIDTH_PX = 2590;

export const MAP_HEIGHT_PX = 3240;

export const LEONIDA_BOUNDS = {
  west: 0,
  south: 0,
  east: 1.0,
  north: 1.251004, // 3240 / 2590
};

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
