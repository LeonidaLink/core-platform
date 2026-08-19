import type { Metadata } from "next";
import ViceMap from "./ViceMap";

export const metadata: Metadata = {
  title: "Leonida 3D Map | Leonida Link",
  description:
    "Explore the fictional Leonida map in 3D. A custom cartographic foundation for the Leonida Link platform.",
  openGraph: {
    title: "Leonida 3D Map | Leonida Link",
    description:
      "Explore the fictional Leonida map in 3D. A custom cartographic foundation for the Leonida Link platform.",
    images: ["/images/map-card.png"],
  },
};

export default function MapPage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0e14]">
      <ViceMap />
    </main>
  );
}
