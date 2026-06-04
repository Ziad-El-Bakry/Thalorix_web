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
