"use client";

import { useState } from "react";
import { User, Menu, X } from "lucide-react";
import WaitlistModal from "@/app/components/WaitlistModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#280242] text-white">
      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-5 max-w-7xl mx-auto w-full">
        {/* Mobile: hamburger left | Desktop: logo left */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-white"
        >
          <Menu size={24} />
        </button>
        <img src="/brand/logo.png" alt="Leonida Link" className="h-10 md:h-12 md:order-first" />

        {/* Desktop nav - centered */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex space-x-10 text-sm font-extrabold uppercase tracking-widest text-white">
          <a href="#" className="hover:text-white/70 transition">Forum</a>
          <a href="#" className="hover:text-white/70 transition">Wiki</a>
          <a href="#" className="hover:text-white/70 transition">Tools</a>
        </nav>

        {/* Desktop: discord + user | Mobile: user only */}
        <div className="flex items-center space-x-4">
          <a href="https://discord.gg/Xc7mejjReX" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 border border-white/60 hover:border-white hover:bg-white/10 px-5 py-2.5 rounded-full text-sm font-extrabold transition bg-transparent">
            <img src="/brand/discord.png" alt="Discord" className="h-5 w-5" />
            Join Discord
          </a>
          <button className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition">
            <User size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative bg-[#1E0032] w-72 h-full p-8 flex flex-col gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="self-end text-white/50 hover:text-white transition"
            >
              <X size={24} />
            </button>
            <nav className="flex flex-col gap-5 text-lg font-extrabold uppercase tracking-widest">
              <a href="#" className="hover:text-white/70 transition">Forum</a>
              <a href="#" className="hover:text-white/70 transition">Wiki</a>
              <a href="#" className="hover:text-white/70 transition">Tools</a>
            </nav>
            <a href="https://discord.gg/Xc7mejjReX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-white/60 hover:border-white hover:bg-white/10 px-5 py-2.5 rounded-full text-sm font-extrabold transition bg-transparent w-fit mt-4">
              <img src="/brand/discord.png" alt="Discord" className="h-5 w-5" />
              Join Discord
            </a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex flex-col justify-end overflow-hidden">
        <img
          src="/images/bridge-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#280242]" />

        <div className="relative z-10 px-6 md:px-8 max-w-7xl mx-auto w-full pb-16">
          <img src="/images/hero-title.png" alt="Leonida Link" className="h-10 md:h-16 mb-3 object-contain object-left" />
          <p className="text-sm md:text-lg text-white/90 max-w-md mb-3 md:mb-4 font-semibold leading-relaxed">
            The all-in-one GTA 6 wiki, tracker, and forum.<br />
            Made by players for players.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#C7E0F5] text-[#112A46] px-6 md:px-8 py-3 md:py-3.5 rounded-full font-extrabold text-sm md:text-base transition hover:scale-105 hover:shadow-lg hover:shadow-[#C7E0F5]/25"
          >
            Join the Waitlist
          </button>
        </div>
      </section>

      {/* Card Section */}
      <section className="py-12 max-w-7xl mx-auto">
        {/* Trending */}
        <div className="px-6 md:px-8 mb-8">
          <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Trending</h3>
        </div>
        <div className="pl-6 md:px-8 mb-12">
          <div className="flex md:grid md:grid-cols-1 gap-4 overflow-x-auto pb-4 scrollbar-hide md:overflow-visible md:max-w-sm">
            <div className="min-w-[280px] md:min-w-0 h-[380px] md:h-[420px] rounded-2xl bg-[#1E0032] flex flex-col overflow-hidden flex-shrink-0">
              <img
                src="/images/map-card.png"
                alt="Vice City 3D Map"
                className="w-full h-48 md:h-56 object-cover"
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
        </div>

        {/* Explore Leonida */}
        <div className="px-6 md:px-8 mb-4">
          <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Explore Leonida</h3>
        </div>
        <div className="pl-6 md:px-8">
          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide md:overflow-visible">
            {/* Forum Card */}
            <div className="min-w-[260px] md:min-w-0 h-[380px] md:h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end flex-shrink-0">
              <img src="/images/forum-card.png" alt="Forum" className="absolute inset-0 w-full h-full object-cover" />
              <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                <h4 className="font-black text-lg mb-1">Forum</h4>
                <p className="text-sm text-gray-300 mb-4 font-semibold">Join the discussion and find your crew.</p>
                <button className="bg-[#0DB9FF] text-white w-fit mx-auto px-5 py-2 rounded-full text-sm font-extrabold transition hover:scale-105 hover:shadow-lg hover:shadow-[#0DB9FF]/30">Enter Forums</button>
              </div>
            </div>

            {/* Wiki Card */}
            <div className="min-w-[260px] md:min-w-0 h-[380px] md:h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end flex-shrink-0">
              <img src="/images/wiki-card.png" alt="Wiki" className="absolute inset-0 w-full h-full object-cover" />
              <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                <h4 className="font-black text-lg mb-1">Wiki</h4>
                <p className="text-sm text-gray-300 mb-4 font-semibold">Explore the ultimate database of Leonida lore.</p>
                <button className="bg-[#545DB0] text-white w-fit mx-auto px-5 py-2 rounded-full text-sm font-extrabold transition hover:scale-105 hover:shadow-lg hover:shadow-[#545DB0]/30">Read Wiki</button>
              </div>
            </div>

            {/* Tools Card */}
            <div className="min-w-[260px] md:min-w-0 h-[380px] md:h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end flex-shrink-0">
              <img src="/images/tools-card.png" alt="Tools" className="absolute inset-0 w-full h-full object-cover" />
              <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                <h4 className="font-black text-lg mb-1">Tools</h4>
                <p className="text-sm text-gray-300 mb-4 font-semibold">Level up your gameplay with essential utilities.</p>
                <button className="bg-[#7969EE] text-white w-fit mx-auto px-5 py-2 rounded-full text-sm font-extrabold transition hover:scale-105 hover:shadow-lg hover:shadow-[#7969EE]/30">View Tools</button>
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