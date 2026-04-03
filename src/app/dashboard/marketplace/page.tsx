"use client";

import UserHeader from "@/components/ui/UserHeader";
import TemplateList from "@/components/features/marketplace/shared/TemplateList";
import { Search, Filter, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Newest First");

  return (
    <div className="-m-4 md:-m-6 lg:-m-10 p-4 md:p-6 lg:p-10 bg-[#E2E3EA] min-h-[calc(100vh-60px)]">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col h-full">
        <div className="border-b-2 border-[#b0c4c4] pb-2 mb-4 relative z-50">
          <UserHeader name="User" badge="Developer" compact={true} />
        </div>

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#123E41] text-white placeholder-gray-300 rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-teal-500/50 pr-12 transition-all"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={20} />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`p-3.5 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors focus:ring-2 focus:ring-teal-500/50 outline-none ${category !== "All Categories" ? "bg-teal-600 text-white" : "bg-[#123E41] text-white hover:bg-[#0d2c2e]"}`} title="Categories">
                  <LayoutGrid size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCategory("All Categories")} className={category === "All Categories" ? "bg-slate-100 font-medium" : ""}>All Categories</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategory("E-Commerce")} className={category === "E-Commerce" ? "bg-slate-100 font-medium" : ""}>E-Commerce</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategory("Social Media")} className={category === "Social Media" ? "bg-slate-100 font-medium" : ""}>Social Media</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategory("Restaurant")} className={category === "Restaurant" ? "bg-slate-100 font-medium" : ""}>Restaurant</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategory("Portfolio")} className={category === "Portfolio" ? "bg-slate-100 font-medium" : ""}>Portfolio</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategory("Dashboard")} className={category === "Dashboard" ? "bg-slate-100 font-medium" : ""}>Dashboard</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`p-3.5 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors focus:ring-2 focus:ring-teal-500/50 outline-none ${sortBy !== "Newest First" ? "bg-teal-600 text-white" : "bg-[#123E41] text-white hover:bg-[#0d2c2e]"}`} title="Filter/Sort">
                  <Filter size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("Newest First")} className={sortBy === "Newest First" ? "bg-slate-100 font-medium" : ""}>Newest First</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("Popularity")} className={sortBy === "Popularity" ? "bg-slate-100 font-medium" : ""}>Popularity</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("Price: Low to High")} className={sortBy === "Price: Low to High" ? "bg-slate-100 font-medium" : ""}>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("Price: High to Low")} className={sortBy === "Price: High to Low" ? "bg-slate-100 font-medium" : ""}>Price: High to Low</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        <TemplateList searchQuery={searchQuery} category={category} sortBy={sortBy} />
      </div>
    </div>
  );
}