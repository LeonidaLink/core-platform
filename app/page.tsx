"use client";

import { useState } from "react";
import { User, Menu, X, ChevronRight, MessageSquare } from "lucide-react";
import WaitlistModal from "@/app/components/WaitlistModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [firstSectionHeading, setFirstSectionHeading] = useState("Trending");

  return (
    <>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        ::selection {
          background: #D5ADF3;
          color: #FFFFFF;
        }
        ::-moz-selection {
          background: #D5ADF3;
          color: #FFFFFF;
        }
      `}</style>
    <main className="min-h-screen bg-[#280242] text-white">
      {/* Header - Desktop Only */}
      <header className="fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full">
        <img src="/brand/logo.png" alt="Leonida Link" className="h-12" />

        <nav className="absolute left-1/2 -translate-x-1/2 flex space-x-10 text-sm font-extrabold uppercase tracking-widest text-white">
          <a href="#" className="px-4 py-2 rounded-full border border-transparent hover:border-white/60 transition-all duration-300">Forum</a>
          <a href="#" className="px-4 py-2 rounded-full border border-transparent hover:border-white/60 transition-all duration-300">Wiki</a>
          <a href="#" className="px-4 py-2 rounded-full border border-transparent hover:border-white/60 transition-all duration-300">Tools</a>
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

      {/* Header - Mobile Only */}
      <header className="fixed top-0 left-0 right-0 z-[90] flex md:hidden items-center justify-between w-full px-6 py-4 bg-transparent">
        <button onClick={() => setIsMenuOpen(true)} className="w-10 h-10 flex items-center justify-center text-white">
          <Menu size={24} />
        </button>
        <img src="/brand/logo.png" alt="Leonida Link" className="h-10" />
        <button className="w-10 h-10 flex items-center justify-center text-white/70">
          <User size={20} />
        </button>
      </header>

      {/* Fullscreen Mobile Menu */}
      <div className={`fixed inset-0 z-[100] bg-[#280242] flex flex-col p-6 transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-end">
          <button onClick={() => setIsMenuOpen(false)} className="w-12 h-12 flex items-center justify-center text-white">
            <X size={28} />
          </button>
        </div>
        <nav className="flex-1 flex flex-col justify-center space-y-6">
          <a href="#" className="flex items-center justify-between text-4xl font-black text-white">
            Forum <ChevronRight size={32} />
          </a>
          <a href="#" className="flex items-center justify-between text-4xl font-black text-white">
            Wiki <ChevronRight size={32} />
          </a>
          <a href="#" className="flex items-center justify-between text-4xl font-black text-white">
            Tools <ChevronRight size={32} />
          </a>
        </nav>
        <a href="https://discord.gg/Xc7mejjReX" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border border-white/60 hover:border-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-extrabold transition bg-transparent mt-8">
          <img src="/brand/discord.png" alt="Discord" className="h-6 w-6" />
          Join Discord
        </a>
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex flex-col justify-end overflow-hidden">
        <img
          src="/images/bridge-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#280242]" />

        <div className="relative z-10 px-8 max-w-7xl mx-auto w-full pb-16">
          <img src="/images/hero-title.png" alt="Leonida Link" className="object-contain w-auto h-auto max-h-16 mb-6" />
          <p className="text-lg text-white/90 max-w-md mb-4 font-semibold leading-relaxed">
            The all-in-one GTA 6 wiki, tracker, and forum.<br />
            Made by players for players.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#C7E0F5] hover:bg-[#A5C4D8] text-[#112A46] px-8 py-3.5 rounded-full font-extrabold text-base transition"
          >
            Join the Waitlist
          </button>
        </div>
      </section>

      {/* Card Section Grid */}
      <section className="px-8 py-12 max-w-7xl mx-auto">
        {/* Desktop headings grid */}
        <div className="hidden md:grid md:grid-cols-5 gap-6 mb-6 w-full">
          <h2 className="text-4xl font-black text-white col-span-2">Trending</h2>
          <h2 className="text-4xl font-black text-white col-span-3">Explore Leonida</h2>
        </div>

        {/* Mobile dynamic heading */}
        <h2 className="md:hidden text-3xl font-black text-white mb-4">{firstSectionHeading}</h2>

        {/* Combined slider wrapper for mobile */}
        <div
          onScroll={(e) => setFirstSectionHeading(e.currentTarget.scrollLeft > 250 ? "Explore Leonida" : "Trending")}
          className="flex flex-row md:grid md:grid-cols-5 overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 md:gap-6 w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Trending Card - wider */}
          <div className="w-[280px] md:w-full md:col-span-2 shrink-0 snap-center">
            <div className="h-[420px] rounded-2xl bg-[#1E0032] flex flex-col overflow-hidden">
              <img
                src="/images/map-card.png"
                alt="Vice City 3D Map"
                className="w-full h-56 object-cover"
              />
              <div className="p-5 flex flex-col justify-end flex-1">
                <h4 className="font-black text-xl mb-1">Vice City 3D Map</h4>
                <p className="text-sm text-gray-400 mb-4 font-semibold">
                  Explore the Vice City map in 3d like you are using Apple Maps
                </p>
                <button className="bg-[#C7E0F5] hover:bg-[#A5C4D8] text-[#112A46] w-fit px-6 py-2.5 rounded-full text-sm font-extrabold transition">
                  View Map
                </button>
              </div>
            </div>
          </div>

          {/* Explore Leonida - 2/3 width */}
          <div className="flex flex-row md:grid md:col-span-3 md:grid-cols-3 gap-4 md:gap-6 w-max md:w-full shrink-0">
              {/* Forum Card */}
              <div className="w-[280px] md:w-full md:col-span-1 shrink-0 snap-center h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end">
                <img
                  src="/images/forum-card.png"
                  alt="Forum"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                  <h4 className="font-black text-xl mb-1">Forum</h4>
                  <p className="text-sm text-gray-300 mb-4 font-semibold">
                    Join the discussion and find your crew.
                  </p>
                  <button className="bg-[#0DB9FF] hover:bg-[#0A9BD4] text-white w-fit mx-auto px-6 py-2.5 rounded-full text-sm font-extrabold transition">
                    Enter Forums
                  </button>
                </div>
              </div>

              {/* Wiki Card */}
              <div className="w-[280px] md:w-full md:col-span-1 shrink-0 snap-center h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end">
                <img
                  src="/images/wiki-card.png"
                  alt="Wiki"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                  <h4 className="font-black text-xl mb-1">Wiki</h4>
                  <p className="text-sm text-gray-300 mb-4 font-semibold">
                    Explore the ultimate database of Leonida lore.
                  </p>
                  <button className="bg-[#545DB0] hover:bg-[#434A8C] text-white w-fit mx-auto px-6 py-2.5 rounded-full text-sm font-extrabold transition">
                    Read Wiki
                  </button>
                </div>
              </div>

              {/* Tools Card */}
              <div className="w-[280px] md:w-full md:col-span-1 shrink-0 snap-center h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end">
                <img
                  src="/images/tools-card.png"
                  alt="Tools"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                  <h4 className="font-black text-xl mb-1">Tools</h4>
                  <p className="text-sm text-gray-300 mb-4 font-semibold">
                    Level up your gameplay with essential utilities.
                  </p>
                  <button className="bg-[#7969EE] hover:bg-[#6154C0] text-white w-fit mx-auto px-6 py-2.5 rounded-full text-sm font-extrabold transition">
                    View Tools
                  </button>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* Forum Section */}
      <section className="relative w-full bg-[#80D0F1] overflow-hidden">
        {/* Background Image - covers upper portion */}
        <div className="absolute inset-0 w-full h-[70%]">
          <img
            src="/images/forum-skyline.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#280242] via-transparent to-[#80D0F1]" />
        </div>

        {/* Forum Header Content */}
        <div className="relative z-10 px-8 max-w-7xl mx-auto w-full pt-134 pb-12">
          <h2 className="text-4xl md:text-7xl font-black tracking-tight text-white mb-4">Forum</h2>
          <p className="text-lg text-white max-w-md mb-6 font-semibold leading-relaxed">
            Connect with the community, discuss emerging theories, and organize your crew in a dedicated player-driven hub
          </p>
          <div className="flex items-center gap-4">
            <button className="bg-[#C7E0F5] hover:bg-[#A5C4D8] text-[#112A46] px-8 py-3.5 rounded-full font-extrabold text-base transition">
              Enter Forums
            </button>
            <button className="border border-white text-white px-8 py-3.5 rounded-full font-extrabold text-base transition hover:scale-105 hover:bg-white/10">
              Rules
            </button>
          </div>
        </div>

        {/* Trending Topics */}
        <div className="relative z-10 px-8 max-w-7xl mx-auto w-full pb-16">
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-6">Trending Topics</h3>

          <div className="flex flex-row md:grid md:grid-cols-5 overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 md:gap-6 w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Card 1 - Jason Vehicles (Trending style) */}
            <div className="w-[280px] md:w-full md:col-span-2 shrink-0 snap-center">
              <div className="h-[420px] rounded-2xl bg-[#0A5ABB] flex flex-col overflow-hidden">
                <img
                  src="/images/jason-vehicles.png"
                  alt="Jason Vehicles"
                  className="w-full h-56 object-cover"
                />
                <div className="p-5 flex flex-col justify-end flex-1">
                  <h4 className="font-black text-xl mb-1">Jason Vehicles</h4>
                  <p className="text-sm text-[#EAE7E7] mb-4 font-semibold">
                    Breaking down all the leaked vehicle customization options for Jason.
                  </p>
                  <div className="flex items-center gap-3">
                    <button className="bg-[#C7E0F5] hover:bg-[#A5C4D8] text-[#112A46] w-fit px-6 py-2.5 rounded-full text-sm font-extrabold transition">
                      View
                    </button>
                    <span className="text-white font-bold text-sm">213</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards 2-4 wrapper (Explore Leonida style) */}
            <div className="flex flex-row md:grid md:col-span-3 md:grid-cols-3 gap-4 md:gap-6 w-max md:w-full shrink-0">
              {/* Card 2 - Vice City Car Meets */}
              <div className="w-[280px] md:w-full md:col-span-1 shrink-0 snap-center h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end">
                <img
                  src="/images/car-meets.png"
                  alt="Vice City Car Meets"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                  <h4 className="font-black text-xl mb-1">Vice City Car Meets</h4>
                  <p className="text-sm text-gray-300 mb-4 font-semibold">
                    Where are the best neon-lit spots in Leonida to host underground meets?
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button className="bg-white text-black w-fit px-6 py-2.5 rounded-full text-sm font-extrabold transition hover:scale-105">
                      Read
                    </button>
                      <span className="text-white font-bold text-sm">101</span>
                    </div>
                  </div>
                </div>

                {/* Card 3 - Boat Parties */}
                <div className="w-[280px] md:w-full md:col-span-1 shrink-0 snap-center h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end">
                  <img
                    src="/images/boat-parties.png"
                    alt="Boat Parties"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                    <h4 className="font-black text-xl mb-1">Boat Parties</h4>
                    <p className="text-sm text-gray-300 mb-4 font-semibold">
                      Discussing the new water physics and yacht mechanics from the trailer.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button className="bg-white hover:bg-gray-200 text-black w-fit px-6 py-2.5 rounded-full text-sm font-extrabold transition">
                        Read
                      </button>
                      <span className="text-white font-bold text-sm">93</span>
                    </div>
                  </div>
                </div>

                {/* Card 4 - Night Activities */}
                <div className="w-[280px] md:w-full md:col-span-1 shrink-0 snap-center h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end">
                  <img
                    src="/images/night-activities.png"
                    alt="Night Activities"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                    <h4 className="font-black text-xl mb-1">Night Activities</h4>
                    <p className="text-sm text-gray-300 mb-4 font-semibold">
                      Mapping out the confirmed nightclubs, bars, and late-night side activities.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button className="bg-white hover:bg-gray-200 text-black w-fit px-6 py-2.5 rounded-full text-sm font-extrabold transition">
                        Read
                      </button>
                      <span className="text-white font-bold text-sm">42</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wiki Section */}
      <section className="relative w-full bg-[#FDAA76] overflow-hidden">
        {/* Background Image - covers upper portion */}
        <div className="absolute inset-0 w-full h-[70%]">
          <img
            src="/images/wiki-sunset.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#80D0F1] via-transparent to-[#FDAA76]" />
        </div>

        {/* Wiki Header Content */}
        <div className="relative z-10 px-8 max-w-7xl mx-auto w-full pt-120 pb-6">
          <h2 className="text-4xl md:text-7xl font-black tracking-tight text-white mb-4">Wiki</h2>
          <p className="text-lg text-white max-w-md mb-6 font-semibold leading-relaxed">
            The definitive encyclopedia of Leonida. Access comprehensive data grids for every character, vehicle, and weapon.
          </p>
          <button className="bg-[#545DB0] hover:bg-[#434A8C] text-white px-8 py-3.5 rounded-full font-extrabold text-base transition">
            Read Wiki
          </button>
        </div>

        {/* Trending Wikis */}
        <div className="relative z-10 px-8 max-w-7xl mx-auto w-full pb-16">
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-6">Trending Wikis</h3>

          <div className="flex flex-row md:grid md:grid-cols-5 overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 md:gap-6 w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Card 1 - Protagonist Bios (Trending style) */}
            <div className="w-[280px] md:w-full md:col-span-2 shrink-0 snap-center">
              <div className="h-[420px] rounded-2xl bg-[#321F20] flex flex-col overflow-hidden">
                <img
                  src="/images/protagonist-bios.png"
                  alt="Protagonist Bios"
                  className="w-full h-56 object-cover"
                />
                <div className="p-5 flex flex-col justify-end flex-1">
                  <h4 className="font-black text-xl mb-1 text-white">Protagonist Bios</h4>
                  <p className="text-sm text-gray-400 mb-4 font-semibold">
                    Deep dive into Jason and Lucia&#39;s backstories, unique abilities, and starting loadouts.
                  </p>
                  <button className="bg-[#F3C934] hover:bg-[#C4A32A] text-[#112A46] w-fit px-6 py-2.5 rounded-full text-sm font-extrabold transition">
                    Read Lore
                  </button>
                </div>
              </div>
            </div>

            {/* Cards 2-4 wrapper (Explore style) */}
            <div className="flex flex-row md:grid md:col-span-3 md:grid-cols-3 gap-4 md:gap-6 w-max md:w-full shrink-0">
              {/* Card 2 - Weapon Telemetry */}
              <div className="w-[280px] md:w-full md:col-span-1 shrink-0 snap-center h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end">
                <img
                  src="/images/weapon-telemetry.png"
                  alt="Weapon Telemetry"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                  <h4 className="font-black text-xl mb-1 text-white">Weapon Telemetry</h4>
                  <p className="text-sm text-gray-300 mb-4 font-semibold">
                    Compare damage drop-offs, fire rates, and recoil patterns for every confirmed firearm.
                  </p>
                  <button className="bg-[#3B3B3B] hover:bg-[#2A2A2A] text-white w-fit mx-auto px-6 py-2.5 rounded-full text-sm font-extrabold transition">
                    View Stats
                  </button>
                </div>
              </div>

              {/* Card 3 - Vehicle Database */}
              <div className="w-[280px] md:w-full md:col-span-1 shrink-0 snap-center h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end">
                <img
                  src="/images/vehicle-database.png"
                  alt="Vehicle Database"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                  <h4 className="font-black text-xl mb-1 text-white">Vehicle Database</h4>
                  <p className="text-sm text-gray-300 mb-4 font-semibold">
                    Top speeds, handling grades, and full customization costs for Leonida&#39;s rides.
                    </p>
                    <button className="bg-[#E2A7A0] hover:bg-[#B5867F] text-white w-fit mx-auto px-6 py-2.5 rounded-full text-sm font-extrabold transition">
                      Browse Vehicles
                    </button>
                  </div>
                </div>

                {/* Card 4 - Real Estate & Safehouses */}
                <div className="w-[280px] md:w-full md:col-span-1 shrink-0 snap-center h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end">
                  <img
                    src="/images/real-estate.png"
                    alt="Real Estate & Safehouses"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                    <h4 className="font-black text-xl mb-1 text-white">Real Estate & Safehouses</h4>
                    <p className="text-sm text-gray-300 mb-4 font-semibold">
                      Track locations, purchase prices, and garage capacities for every property in the game.
                    </p>
                    <button className="bg-[#60B3E9] hover:bg-[#4D8FB8] text-white w-fit mx-auto px-6 py-2.5 rounded-full text-sm font-extrabold transition">
                      View Properties
                    </button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="relative w-full bg-[#505D78] overflow-hidden">
        {/* Background Image - covers upper portion */}
        <div className="absolute inset-0 w-full h-[70%]">
          <img
            src="/images/tools-neon.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDAA76] via-transparent to-[#505D78]" />
        </div>

        {/* Tools Header Content */}
        <div className="relative z-10 px-8 max-w-7xl mx-auto w-full pt-120 pb-6">
          <h2 className="text-4xl md:text-7xl font-black tracking-tight text-white mb-4">Tools</h2>
          <p className="text-lg text-white max-w-md mb-6 font-semibold leading-relaxed">
            Maximize your gameplay with our minimalist 3D track names, interactive checklists, and progression tools.
          </p>
          <button className="bg-[#7969EE] hover:bg-[#6154C0] text-white px-8 py-3.5 rounded-full font-extrabold text-base transition">
            View Tools
          </button>
        </div>

        {/* Trending Pages */}
        <div className="relative z-10 px-8 max-w-7xl mx-auto w-full pb-16">
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-6">Trending Pages</h3>

          <div className="flex flex-row md:grid md:grid-cols-5 overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 md:gap-6 w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Card 1 - Vice City 3D Map (Trending style) */}
            <div className="w-[280px] md:w-full md:col-span-2 shrink-0 snap-center">
              <div className="h-[420px] rounded-2xl bg-[#1E0032] flex flex-col overflow-hidden">
                <img
                  src="/images/map-card.png"
                  alt="Vice City 3D Map"
                  className="w-full h-56 object-cover"
                />
                <div className="p-5 flex flex-col justify-end flex-1">
                  <h4 className="font-black text-xl mb-1 text-white">Vice City 3D Map</h4>
                  <p className="text-sm text-gray-400 mb-4 font-semibold">
                    Explore the Vice City map in 3d like you are using Apple Maps.
                  </p>
                  <button className="bg-[#C7E0F5] text-[#112A46] w-fit px-6 py-2.5 rounded-full text-sm font-extrabold transition hover:scale-105 hover:shadow-lg hover:shadow-[#C7E0F5]/25">
                    View Map
                  </button>
                </div>
              </div>
            </div>

            {/* Cards 2-4 wrapper (Explore style) */}
            <div className="flex flex-row md:grid md:col-span-3 md:grid-cols-3 gap-4 md:gap-6 w-max md:w-full shrink-0">
              {/* Card 2 - Completion Tracker */}
              <div className="w-[280px] md:w-full md:col-span-1 shrink-0 snap-center h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end">
                <img
                  src="/images/completion-tracker.png"
                  alt="Completion Tracker"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                  <h4 className="font-black text-xl mb-1 text-white">Completion Tracker</h4>
                  <p className="text-sm text-gray-300 mb-4 font-semibold">
                    Never miss a collectible. Log your progress across missions, random events, and achievements.
                    </p>
                    <button className="bg-[#757F6E] hover:bg-[#5E6660] text-white w-fit mx-auto px-6 py-2.5 rounded-full text-sm font-extrabold transition">
                      Start Tracking
                    </button>
                  </div>
                </div>

                {/* Card 3 - Loadout Calculator */}
                <div className="w-[280px] md:w-full md:col-span-1 shrink-0 snap-center h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end">
                  <img
                    src="/images/loadout-calculator.png"
                    alt="Loadout Calculator"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                    <h4 className="font-black text-xl mb-1 text-white">Loadout Calculator</h4>
                    <p className="text-sm text-gray-300 mb-4 font-semibold">
                      Optimize your inventory. Calculate damage thresholds, weapon costs, and handling stats.
                    </p>
                    <button className="bg-[#424345] hover:bg-[#323335] text-white w-fit mx-auto px-6 py-2.5 rounded-full text-sm font-extrabold transition">
                      Build Loadout
                    </button>
                  </div>
                </div>

                {/* Card 4 - Dynamic Checklists */}
                <div className="w-[280px] md:w-full md:col-span-1 shrink-0 snap-center h-[420px] rounded-2xl overflow-hidden relative flex flex-col justify-end">
                  <img
                    src="/images/dynamic-checklists.png"
                    alt="Dynamic Checklists"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="relative z-10 p-5 pt-16 bg-gradient-to-t from-black/70 to-transparent text-center">
                    <h4 className="font-black text-xl mb-1 text-white">Dynamic Checklists</h4>
                    <p className="text-sm text-gray-300 mb-4 font-semibold">
                      Interactive to-do lists. Track side activities and set custom goals for your playthrough.
                    </p>
                    <button className="bg-[#A6A7A1] hover:bg-[#858681] text-white w-fit mx-auto px-6 py-2.5 rounded-full text-sm font-extrabold transition">
                      View Checklists
                    </button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Modal */}
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Footer */}
      <footer className="w-full bg-[#505D78] pt-16 pb-8 px-6 md:px-12 border-t border-white/10 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 mb-12">
          {/* Column 1: Brand */}
          <div className="md:col-span-1 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-4">
              {/* Reusing the logo header styling logic */}
             <img src="/images/hero-title.png" alt="Leonida Link" className="h-12" />
            </div>
            <p className="text-white/60 text-sm font-semibold leading-relaxed">
              The all-in-one GTA 6 wiki, tracker, and forum. Made by players for players. Not affiliated with Rockstar Games.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold text-lg mb-2">Explore</h4>
            <a href="#" className="text-white/60 font-semibold hover:text-white transition-colors text-sm">Interactive Map</a>
            <a href="#" className="text-white/60 font-semibold hover:text-white transition-colors text-sm">Wiki Database</a>
            <a href="#" className="text-white/60 font-semibold hover:text-white transition-colors text-sm">Community Forum</a>
            <a href="#" className="text-white/60 font-semibold hover:text-white transition-colors text-sm">Loadout Calculator</a>
          </div>

          {/* Column 3: Community */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold text-lg mb-2">Community</h4>
            <a href="#" className="text-white/60 font-semibold hover:text-white transition-colors text-sm">Discord Server</a>
            <a href="#" className="text-white/60 font-semibold hover:text-white transition-colors text-sm">Twitter / X</a>
            <a href="#" className="text-white/60 font-semibold hover:text-white transition-colors text-sm">YouTube</a>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold text-lg mb-2">Legal</h4>
            <a href="#" className="text-white/60 font-semibold hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-white/60 font-semibold hover:text-white transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-white/60 font-semibold hover:text-white transition-colors text-sm">Forum Rules</a>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs text-center font-semibold md:text-left">
            © 2026 Leonida Link. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/40 hover:text-white transition-colors"><MessageSquare size={18} /></a>
            <a href="#" className="text-white/40 hover:text-white transition-colors"><X size={18} /></a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">YT</a>
          </div>
        </div>
      </footer>
    </main>
    </>
  );
}