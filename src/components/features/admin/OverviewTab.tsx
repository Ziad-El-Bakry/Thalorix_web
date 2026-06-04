"use client";

import { motion } from "framer-motion";
import { FileText, ShoppingCart, DollarSign, Users, Store, TrendingUp } from "lucide-react";
import AdminStatCard from "./AdminStatCard";
import { mockRestrictedUsers } from "./adminMockData";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Mock user growth data
const GROWTH_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const GROWTH_VALUES = [180, 220, 310, 380, 450, 520];
const MAX_GROWTH = Math.max(...GROWTH_VALUES);

export default function OverviewTab() {
  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col gap-6">
      {/* Top Stat Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          icon={<Users size={20} className="text-blue-600" />}
          iconBg="#3B82F6"
          value={2847}
          label="Total Users"
          subtitle="Registered accounts"
          live={false}
        />
        <AdminStatCard
          icon={<Store size={20} className="text-emerald-600" />}
          iconBg="#10B981"
          value={184}
          label="Active Sellers"
          subtitle="Verified stores"
          live={false}
        />
        <AdminStatCard
          icon={<FileText size={20} className="text-violet-600" />}
          iconBg="#8B5CF6"
          value={1256}
          label="Total Templates"
          subtitle="Available in marketplace"
          live={false}
        />
        <AdminStatCard
          icon={<DollarSign size={20} className="text-amber-600" />}
          iconBg="#F59E0B"
          value={24800}
          prefix="$"
          label="Monthly Revenue"
          subtitle="From completed orders"
          live={true}
        />
      </motion.div>

      {/* Main Bottom Section */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Platform Growth</h3>
              <p className="text-xs text-gray-500 mt-0.5">New user registrations</p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp size={16} /> +22%
            </div>
          </div>
          <div className="flex items-end gap-4 flex-1 min-h-[220px]">
            {GROWTH_MONTHS.map((month, i) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="text-[11px] font-bold text-gray-600 mb-1">{GROWTH_VALUES[i]}</div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(GROWTH_VALUES[i] / MAX_GROWTH) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                  className="w-full rounded-t-lg min-h-[8px]"
                  style={{
                    background: i === GROWTH_MONTHS.length - 1
                      ? "linear-gradient(180deg, #43B0B5 0%, #103B40 100%)"
                      : "linear-gradient(180deg, #e5e7eb 0%, #d1d5db 100%)",
                  }}
                />
                <span className="text-[11px] text-gray-400 font-medium">{month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Restricted Users */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">Restricted Users</h3>
            <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-1 rounded-lg">
              {mockRestrictedUsers.length} limited
            </span>
          </div>
          <div className="space-y-3 overflow-y-auto flex-1 pr-2 sidebar-scrollbar max-h-[250px]">
            {mockRestrictedUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: user.color }}
                >
                  {user.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-800 font-bold">{user.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.restrictions.map((r) => (
                      <span key={r} className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-wider border border-red-100">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
