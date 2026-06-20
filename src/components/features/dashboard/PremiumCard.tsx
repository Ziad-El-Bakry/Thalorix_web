"use client";

import { Zap, CheckCircle2, ArrowRight } from "lucide-react";

export default function PremiumCard() {
  return (
    <div className="bg-[#103B40] rounded-2xl p-6 shadow-lg flex flex-col h-full text-white relative overflow-hidden border border-transparent dark:border-gray-700/30">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#43B0B5]/20 rounded-full blur-xl"></div>
      
      <div className="relative z-10 mb-4">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-yellow-400 mb-4 backdrop-blur-sm">
          <Zap size={20} fill="currentColor" />
        </div>
        <h3 className="text-xl font-bold mb-2">Go Premium</h3>
        <p className="text-sm text-gray-300 font-medium leading-relaxed">
          Unlock advanced analytics, AI job matching & recruiter InMail access.
        </p>
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col justify-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#43B0B5]" />
          <span className="text-sm text-gray-200">Recruiter contact tools</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#43B0B5]" />
          <span className="text-sm text-gray-200">AI resume builder</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#43B0B5]" />
          <span className="text-sm text-gray-200">Unlimited profile views</span>
        </div>
      </div>

      <button className="relative z-10 w-full py-3 rounded-xl bg-[#43B0B5] hover:bg-[#389a9f] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md">
        Try Free 30 Days <ArrowRight size={16} />
      </button>
    </div>
  );
}
