"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.from("waitlist").insert({ email });

    if (error) {
      if (error.code === "23505") {
        setErrorMsg("You're already on the waitlist!");
      } else {
        setErrorMsg("Something went wrong. Try again.");
      }
      setStatus("error");
    } else {
      setStatus("success");
      setEmail("");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1E0032] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black mb-2">Coming Soon</h2>
        <p className="text-white/70 font-semibold text-sm mb-6">
          Leonida Link is launching soon. Join the waitlist to get early access.
        </p>

        {status === "success" ? (
          <div className="text-center py-4">
            <p className="text-[#C7E0F5] font-bold text-lg">You&apos;re in! 🎉</p>
            <p className="text-white/60 text-sm mt-2 font-semibold">
              We&apos;ll notify you when we launch.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition font-semibold text-sm"
            />
            {status === "error" && (
              <p className="text-red-400 text-sm font-semibold">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-[#C7E0F5] text-[#112A46] px-6 py-3 rounded-full font-extrabold text-sm transition hover:scale-105 hover:shadow-lg hover:shadow-[#C7E0F5]/20 disabled:opacity-50"
            >
              {status === "loading" ? "Joining..." : "Join the Waitlist"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
