import type { Metadata } from "next";
import ViceMap from "./ViceMap";
import { getPublishedShapes } from "@/app/actions/mapShapes";

export const dynamic = "force-dynamic";

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

export default async function MapPage() {
  const shapes = await getPublishedShapes().catch(() => []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0e14]">
      <ViceMap shapes={shapes} />
    </main>
  );
}
