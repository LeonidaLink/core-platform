export interface BuildingPreset {
  id: string;
  label: string;
  width: number; // meters
  depth: number; // meters
  height: number; // meters
  color: string;
}

export const BUILDING_PRESETS: BuildingPreset[] = [
  { id: "house", label: "House", width: 12, depth: 10, height: 6, color: "#D4A574" },
  { id: "shop", label: "Shop", width: 20, depth: 15, height: 8, color: "#34D399" },
  { id: "apartment", label: "Apartment", width: 35, depth: 25, height: 25, color: "#F472B6" },
  { id: "office", label: "Office Block", width: 50, depth: 40, height: 60, color: "#0DB9FF" },
  { id: "tower", label: "Tower", width: 40, depth: 40, height: 120, color: "#FF69B4" },
  { id: "skyscraper", label: "Skyscraper", width: 45, depth: 45, height: 220, color: "#7969EE" },
  { id: "hotel", label: "Hotel", width: 60, depth: 30, height: 90, color: "#FBBF24" },
  { id: "warehouse", label: "Warehouse", width: 80, depth: 50, height: 12, color: "#9CA3AF" },
  { id: "parking", label: "Parking Garage", width: 60, depth: 40, height: 20, color: "#6B7280" },
];
