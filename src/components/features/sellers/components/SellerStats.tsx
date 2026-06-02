"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, ShoppingBag, Globe, Download, MessageSquare, Star } from "lucide-react";

interface SellerStatsProps {
  seller: any;
  followersCount: number;
  templatesCount: number;
  reviewsCount: number;
}

export default function SellerStats({
  seller,
  followersCount,
  templatesCount,
  reviewsCount,
}: SellerStatsProps) {
  const averageRating = seller.ratings || seller.rating || 5;

  const stats = [
    { label: "Followers", value: followersCount, icon: Users, color: "text-blue-500 bg-blue-50" },
    { label: "Store Sales", value: seller.salesCount || 0, icon: ShoppingBag, color: "text-emerald-500 bg-emerald-50" },
    { label: "Templates", value: templatesCount, icon: Globe, color: "text-purple-500 bg-purple-50" },
    { label: "Total Downloads", value: seller.downloadsCount || 0, icon: Download, color: "text-amber-500 bg-amber-50" },
    { label: "Reviews", value: reviewsCount, icon: MessageSquare, color: "text-cyan-500 bg-cyan-50" },
    { label: "Store Rating", value: `${averageRating}/5`, icon: Star, color: "text-red-500 bg-red-50", isGoldStar: true },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
              <div className={`p-2 rounded-xl ${stat.color} flex items-center justify-center w-8 h-8`}>
                <Icon size={14} className={stat.isGoldStar ? "fill-amber-400 text-amber-500" : ""} />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{stat.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
