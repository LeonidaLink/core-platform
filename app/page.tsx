"use client";

import { useState } from "react";
import { User } from "lucide-react";
import WaitlistModal from "@/app/components/WaitlistModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#280242] text-white">
      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full">
        <img src="/brand/logo.png" alt="Leonida Link" className="h-12" />

        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex space-x-10 text-sm font-extrabold uppercase tracking-widest text-white">
          <a href="#" className="hover:text-white/70 transition">Forum</a>
          <a href="#" className="hover:text-white/70 transition">Wiki</a>
          <a href="#" className="hover:text-white/70 transition">Tools</a>
        </nav>

        <div className="flex items-center space-x-4">
          <a href="https://discord.gg/Xc7mejjReX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-white/60 hover:border-white hover:bg-white/10 px-5 py-2.5 rounded-full text-sm font-extrabold transition bg-transparent">
            <img src="/brand/discord.png" alt="Discord" className="h-5 w-5" />
            Join Discord
          </a>
          <button className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition">
            <User size={20} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex flex-col justify-end overflow-hidden">
        <img
          src="/images/bridge-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#280242]" />

        <div className="relative z-10 px-8 max-w-7xl mx-auto w-full pb-16">
          <img src="/images/hero-title.png" alt="Leonida Link" className="h-16 mb-3" />
          <p className="text-lg text-white/90 max-w-md mb-4 font-semibold leading-relaxed">
            The all-in-one GTA 6 wiki, tracker, and forum.<br />
            Made by players for players.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#C7E0F5] text-[#112A46] px-8 py-3.5 rounded-full font-extrabold text-base transition hover:scale-105 hover:shadow-lg hover:shadow-[#C7E0F5]/25"
          >
            Join the Waitlist
          </button>
        </div>
      </section>

      {/* Card Section Grid */}
      <section className="px-8 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Trending Card - wider */}
          <div className="md:col-span-1">
            <h3 className="text-4xl font-black tracking-tight mb-4">Trending</h3>
            <div className="h-[420px] rounded-2xl bg-[#1E0032] flex flex-col overflow-hidden">
              <img
                src="/images/map-card.png"
                alt="Vice City 3D Map"
                className="w-full h-56 object-cover"
              />
              <div className="p-5 flex flex-col justify-end flex-1">
                <h4 className="font-black text-lg mb-1">Vice City 3D Map</h4>
                <p className="text-sm text-gray-400 mb-4 font-semibold">
                  Explore the Vice City map in 3d like you are using Apple Maps
                </p>
                <button className="bg-[#C7E0F5] text-[#112A46] w-fit px-5 py-2 rounded-full text-sm font-extrabold transition hover:scale-105 hover:shadow-lg hover:shadow-[#C7E0F5]/25">
                  View Map
                </button>
              </div>
            </div>
          </div>

          {/* Explore Leonida - 2/3 width */}
          <div className="md:col-span-2">
            <h3 className="text-4xl font-black tracking-tight mb-4">Explore Leonida</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Forum Card */}
              <div className="h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end">
                <img
                  src="/images/forum-card.png"
                  alt="Forum"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                  <h4 className="font-black text-lg mb-1">Forum</h4>
                  <p className="text-sm text-gray-300 mb-4 font-semibold">
                    Join the discussion and find your crew.
                  </p>
                  <button className="bg-[#0DB9FF] text-white w-fit mx-auto px-5 py-2 rounded-full text-sm font-extrabold transition hover:scale-105 hover:shadow-lg hover:shadow-[#0DB9FF]/30">
                    Enter Forums
                  </button>
                </div>
              </div>

              {/* Wiki Card */}
              <div className="h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end">
                <img
                  src="/images/wiki-card.png"
                  alt="Wiki"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                  <h4 className="font-black text-lg mb-1">Wiki</h4>
                  <p className="text-sm text-gray-300 mb-4 font-semibold">
                    Explore the ultimate database of Leonida lore.
                  </p>
                  <button className="bg-[#545DB0] text-white w-fit mx-auto px-5 py-2 rounded-full text-sm font-extrabold transition hover:scale-105 hover:shadow-lg hover:shadow-[#545DB0]/30">
                    Read Wiki
                  </button>
                </div>
              </div>

              {/* Tools Card */}
              <div className="h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end">
                <img
                  src="/images/tools-card.png"
                  alt="Tools"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                  <h4 className="font-black text-lg mb-1">Tools</h4>
                  <p className="text-sm text-gray-300 mb-4 font-semibold">
                    Level up your gameplay with essential utilities.
                  </p>
                  <button className="bg-[#7969EE] text-white w-fit mx-auto px-5 py-2 rounded-full text-sm font-extrabold transition hover:scale-105 hover:shadow-lg hover:shadow-[#7969EE]/30">
                    View Tools
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Modal */}
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}