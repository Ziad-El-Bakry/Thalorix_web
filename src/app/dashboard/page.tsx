"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Eye, Users, BarChart3, Search } from "lucide-react";
import DashboardHeader from "@/components/features/dashboard/DashboardHeader";
import StatCard from "@/components/features/dashboard/StatCard";
import ProfileViewsChart from "@/components/features/dashboard/ProfileViewsChart";
import LiveActivity from "@/components/features/dashboard/LiveActivity";
import PostPerformanceChart from "@/components/features/dashboard/PostPerformanceChart";
import NetworkGrowthChart from "@/components/features/dashboard/NetworkGrowthChart";
import SkillRadarChart from "@/components/features/dashboard/SkillRadarChart";
import TopPerformingPosts from "@/components/features/dashboard/TopPerformingPosts";
import ProfileScore from "@/components/features/dashboard/ProfileScore";
import QuickActionsGrid from "@/components/features/dashboard/QuickActionsGrid";
import { authService, User } from "@/lib/api/services/auth.service";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Attempt to get user from local storage
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-12">
      <DashboardHeader user={user} />

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

        {/* Bottom Section (Columns) */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <TopPerformingPosts />
            <ProfileScore />
          </div>
          
          {/* Right Column */}
          <div className="flex flex-col gap-6">
            <QuickActionsGrid />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
