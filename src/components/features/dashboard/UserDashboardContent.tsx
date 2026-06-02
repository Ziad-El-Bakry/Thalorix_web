"use client";

import { motion, Variants } from "framer-motion";
import { Eye, Users, BarChart3, Search, Store, ArrowUpRight } from "lucide-react";
import StatCard from "./StatCard";
import ProfileViewsChart from "./ProfileViewsChart";
import LiveActivity from "./LiveActivity";
import PostPerformanceChart from "./PostPerformanceChart";
import NetworkGrowthChart from "./NetworkGrowthChart";
import SkillRadarChart from "./SkillRadarChart";
import TopPerformingPosts from "./TopPerformingPosts";
import ProfileScore from "./ProfileScore";
import QuickActionsGrid from "./QuickActionsGrid";
import Link from "next/link";
import type { User } from "@/lib/api/services/auth.service";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function UserDashboardContent({ user }: { user: User | null }) {
  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Become a Seller CTA */}
      <motion.div variants={itemVariants}>
        <Link href="/dashboard/become-seller">
          <div className="relative overflow-hidden rounded-2xl p-5 cursor-pointer group transition-all hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #103B40 0%, #1a5c5f 50%, #134e4e 100%)",
              border: "1px solid rgba(67,176,181,0.2)",
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#43B0B5] opacity-10 -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-[#43B0B5] opacity-5 translate-y-6 -translate-x-6" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#43B0B5]/20 flex items-center justify-center flex-shrink-0">
                <Store size={22} className="text-[#43B0B5]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-base">Start Selling on Thalorix</h3>
                <p className="text-white/50 text-sm mt-0.5">Upload templates, earn money, build your brand</p>
              </div>
              <ArrowUpRight size={20} className="text-[#43B0B5] flex-shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Row 1: Stat Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Profile Views" value="3,247" trend="+12%" trendDirection="up" icon={<Eye size={20} className="text-[#103B40]" />} />
        <StatCard title="Connections" value="1,400" trend="+5%" trendDirection="up" icon={<Users size={20} className="text-yellow-500" />} />
        <StatCard title="Post Impressions" value="18.4k" trend="+28%" trendDirection="up" icon={<BarChart3 size={20} className="text-blue-500" />} />
        <StatCard title="Search Appearances" value="321" trend="-4%" trendDirection="down" icon={<Search size={20} className="text-gray-600" />} />
      </motion.div>

      {/* Row 2: Main Chart & Activity */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileViewsChart />
        </div>
        <div className="lg:col-span-1 h-[350px]">
          <LiveActivity />
        </div>
      </motion.div>

      {/* Row 3: Secondary Analytics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-[350px]"><PostPerformanceChart /></div>
        <div className="h-[350px]"><NetworkGrowthChart /></div>
        <div className="h-[350px]"><SkillRadarChart /></div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <TopPerformingPosts />
          <ProfileScore />
        </div>
        <div className="flex flex-col gap-6">
          <QuickActionsGrid />
        </div>
      </motion.div>
    </motion.div>
  );
}
