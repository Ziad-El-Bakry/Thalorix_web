"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down";
  icon: ReactNode;
}

export default function StatCard({ title, value, trend, trendDirection, icon }: StatCardProps) {
  const isUp = trendDirection === "up";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col justify-between min-h-[140px]"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl shadow-sm border border-gray-100">
          {icon}
        </div>
        <div 
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
            isUp 
              ? "bg-emerald-50 text-emerald-600" 
              : "bg-red-50 text-red-600"
          }`}
        >
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm font-medium text-gray-400">{title}</p>
      </div>
    </motion.div>
  );
}
