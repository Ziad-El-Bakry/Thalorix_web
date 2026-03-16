"use client";

import UserHeader from "@/components/ui/UserHeader";
import TemplateList from "@/components/features/marketplace/shared/TemplateList";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

export default function MarketplacePage() {
  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col h-full">
      <UserHeader name="User" badge="Developer" />

      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-4 mt-2 mb-2"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#123E41] text-white placeholder-gray-300 rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-teal-500/50 pr-12 transition-all"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={20} />
        </div>
        <button className="bg-[#123E41] text-white p-3.5 rounded-xl flex-shrink-0 flex items-center justify-center hover:bg-[#0d2c2e] transition-colors focus:ring-2 focus:ring-teal-500/50 outline-none">
          <Filter size={20} />
        </button>
      </motion.div>

      <TemplateList />
    </div>
  );
}