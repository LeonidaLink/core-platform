"use client";

import { useState } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1E0032] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition"
        >
          <X size={20} />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-6 text-center animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="w-16 h-16 bg-[#C7E0F5]/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="text-[#C7E0F5]" size={32} />
            </div>
            <h3 className="text-xl font-black text-white mb-2">You&apos;re on the list.</h3>
            <p className="text-white/60 text-sm font-semibold">Keep an eye on your inbox for early access.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-black text-white mb-2">Join the Waitlist</h2>
            <p className="text-white/70 font-semibold text-sm mb-6">
              Leonida Link is launching soon. Drop your email for early access.
            </p>

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
                className="w-full flex items-center justify-center gap-2 bg-[#C7E0F5] hover:bg-[#A5C4D8] text-[#112A46] px-6 py-3 rounded-full font-extrabold text-sm transition active:scale-[0.98] disabled:opacity-50"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Joining...
                  </>
                ) : (
                  "Join the Waitlist"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
