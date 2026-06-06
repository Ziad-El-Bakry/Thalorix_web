"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function AdminPanelHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mb-6 gap-4"
    >
      {/* Left: Icon + Title */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#103B40] flex items-center justify-center shadow-lg">
          <Shield size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage posts, products, orders & user permissions across THALORIX
          </p>
        </div>
      </div>

      {/* Right: Badges */}
      <div className="flex items-center gap-3 flex-wrap">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold border border-emerald-100 shadow-sm"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span>Admin Mode Active</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
