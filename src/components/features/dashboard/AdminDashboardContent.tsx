"use client";

import { motion, Variants } from "framer-motion";
import {
  Users,
  Store,
  FileText,
  DollarSign,
  Flag,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Shield,
} from "lucide-react";
import Link from "next/link";
import type { User } from "@/lib/api/services/auth.service";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

interface PlatformStat {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  bg: string;
  href: string;
}

const PLATFORM_STATS: PlatformStat[] = [
  {
    label: "Total Users",
    value: "2,847",
    trend: "+12%",
    trendUp: true,
    icon: <Users size={20} className="text-blue-600" />,
    bg: "#eff6ff",
    href: "/dashboard/admin/users",
  },
  {
    label: "Active Sellers",
    value: "184",
    trend: "+8%",
    trendUp: true,
    icon: <Store size={20} className="text-emerald-600" />,
    bg: "#ecfdf5",
    href: "/dashboard/admin/sellers",
  },
  {
    label: "Total Templates",
    value: "1,256",
    trend: "+15%",
    trendUp: true,
    icon: <FileText size={20} className="text-violet-600" />,
    bg: "#f5f3ff",
    href: "/dashboard/admin/content",
  },
  {
    label: "Monthly Revenue",
    value: "$24.8k",
    trend: "+22%",
    trendUp: true,
    icon: <DollarSign size={20} className="text-amber-600" />,
    bg: "#fffbeb",
    href: "/dashboard/admin/reports",
  },
];

const ACTION_ITEMS = [
  { label: "Flagged Posts", count: 3, icon: <Flag size={16} />, color: "#ef4444", bg: "#fef2f2", href: "/dashboard/admin/content" },
  { label: "Pending Reviews", count: 5, icon: <Clock size={16} />, color: "#f59e0b", bg: "#fffbeb", href: "/dashboard/admin/content" },
  { label: "Reported Users", count: 2, icon: <AlertTriangle size={16} />, color: "#dc2626", bg: "#fef2f2", href: "/dashboard/admin/users" },
  { label: "Seller Verifications", count: 4, icon: <CheckCircle size={16} />, color: "#10b981", bg: "#ecfdf5", href: "/dashboard/admin/sellers" },
];

const RECENT_ACTIVITY = [
  { icon: "📝", message: 'Sophia Smith published "Building Scalable Design Systems"', time: "2m ago", bg: "#dcfce7" },
  { icon: "🛒", message: "Alex Chen purchased Pro Dashboard UI Kit", time: "15m ago", bg: "#cffafe" },
  { icon: "🚩", message: 'Post "Crypto Airdrop Guide" was flagged for review', time: "1h ago", bg: "#fee2e2" },
  { icon: "⭐", message: "New 5-star review on React Component Library", time: "2h ago", bg: "#fef3c7" },
  { icon: "🔑", message: "User permissions updated for James Hernandez", time: "3h ago", bg: "#e0e7ff" },
  { icon: "💰", message: "Monthly payout processed for 42 sellers ($12,450)", time: "5h ago", bg: "#ffedd5" },
  { icon: "👤", message: "New seller registration: Emma Design Studio", time: "6h ago", bg: "#ecfdf5" },
];

// Mock user growth data
const GROWTH_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const GROWTH_VALUES = [180, 220, 310, 380, 450, 520];
const MAX_GROWTH = Math.max(...GROWTH_VALUES);

export default function AdminDashboardContent({ user }: { user: User | null }) {
  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Quick Access Bar */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
        <Link href="/dashboard/admin">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-[#103B40] hover:bg-[#0d2c2e] text-white px-5 py-3 rounded-xl transition-colors font-medium text-sm shadow-sm"
          >
            <Shield size={16} /> Admin Panel
          </motion.button>
        </Link>
        <Link href="/dashboard/admin/users">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-[#103B40] px-5 py-3 rounded-xl transition-colors font-medium text-sm shadow-sm border border-gray-200"
          >
            <Users size={16} /> Manage Users
          </motion.button>
        </Link>
        <Link href="/dashboard/admin/reports">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-[#103B40] px-5 py-3 rounded-xl transition-colors font-medium text-sm shadow-sm border border-gray-200"
          >
            <TrendingUp size={16} /> Reports
          </motion.button>
        </Link>
      </motion.div>

      {/* Platform Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PLATFORM_STATS.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: stat.bg }}>
                  {stat.icon}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trendUp ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}`}>
                  {stat.trend}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Action Required + User Growth */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Action Required */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">Action Required</h3>
            <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded-lg">
              {ACTION_ITEMS.reduce((sum, i) => sum + i.count, 0)} items
            </span>
          </div>
          <div className="space-y-3">
            {ACTION_ITEMS.map((item) => (
              <Link key={item.label} href={item.href}>
                <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.bg, color: item.color }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-bold" style={{ color: item.color }}>{item.count}</span>
                    <ArrowUpRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Platform Growth</h3>
              <p className="text-xs text-gray-500 mt-0.5">New user registrations</p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
              <TrendingUp size={16} /> +22%
            </div>
          </div>
          <div className="flex items-end gap-4 h-[200px]">
            {GROWTH_MONTHS.map((month, i) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
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
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
          <Link href="/dashboard/admin" className="text-xs text-[#103B40] font-semibold hover:underline flex items-center gap-1">
            View All <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="space-y-1">
          {RECENT_ACTIVITY.map((activity, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: activity.bg }}>
                {activity.icon}
              </div>
              <p className="text-sm text-gray-700 flex-1 min-w-0 truncate">{activity.message}</p>
              <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
