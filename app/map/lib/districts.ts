export type District = {
  name: string;
  coords: [number, number];
};

export const DISTRICTS: District[] = [
  // Ocean Beach / South Beach
  { name: "Ocean Beach", coords: [-80.1300, 25.7780] },
  // Downtown / Brickell
  { name: "Downtown", coords: [-80.1900, 25.7650] },
  // Little Havana / Little Haiti
  { name: "Little Havana", coords: [-80.2150, 25.7780] },
  // Coconut Grove / Key Biscayne
  { name: "Coconut Grove", coords: [-80.1650, 25.7280] },
  // Miami Beach / Starfish Island
  { name: "Starfish Island", coords: [-80.1580, 25.7680] },
  // North Miami / North Beach
  { name: "North Beach", coords: [-80.1350, 25.8100] },
];
