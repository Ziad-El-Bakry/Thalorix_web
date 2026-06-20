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
      className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:shadow-gray-900/30 flex flex-col justify-between min-h-[140px] border border-transparent dark:border-gray-800"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xl shadow-sm border border-gray-100 dark:border-gray-700">
          {icon}
        </div>
        <div 
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
            isUp 
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
              : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
          }`}
        >
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
        <p className="text-sm font-medium text-gray-400 dark:text-gray-500">{title}</p>
      </div>
    </motion.div>
  );
}
