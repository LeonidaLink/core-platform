import type { Metadata } from "next";
import StudioMap from "./StudioMap";

export const metadata: Metadata = {
  title: "Map Studio | Leonida Link",
  description:
    "Trace and annotate the Leonida map. A private tool for creating custom map overlays.",
};

export default function StudioPage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0e14]">
      <StudioMap />
    </main>
  );
}
