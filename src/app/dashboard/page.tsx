"use client";

import QuickAccessCard from "@/components/ui/QuickAccessCard";
import ActivityItem from "@/components/ui/ActivityItem";
import SectionHeader from "@/components/ui/SectionHeader";
import UserHeader from "@/components/ui/UserHeader";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <UserHeader name="User" badge="Developer" />

      {/* Quick Access */}
      <SectionHeader title="Quick Access" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          xl:grid-cols-4 
          gap-6 
          mb-12
        "
      >
        <QuickAccessCard
          title="Upload Template"
          description="Share templates"
          icon="⬆️"
          href="/dashboard/marketplace/upload"
        />
        <QuickAccessCard
          title="Community"
          description="Join discussions"
          icon="👥"
          href="/dashboard/community"
        />
        <QuickAccessCard
          title="Messages"
          description="Chat with team"
          icon="💬"
          href="/dashboard/messages"
        />
        <QuickAccessCard
          title="Analytics"
          description="Track performance"
          icon="📈"
          href="/dashboard/analytics"
        />
      </motion.div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm">
        <SectionHeader
          title="Recent Activity"
          viewAllHref="/dashboard/activity"
        />

        <div className="space-y-4">
          <ActivityItem
            icon="📦"
            iconBg="#E0F2FE"
            title="E-commerce Template"
            subtitle="Purchased 2 hours ago"
            status="Downloaded"
            statusColor="#3B82F6"
          />

          <ActivityItem
            icon="⚛️"
            iconBg="#FEF3C7"
            title="React Component"
            subtitle="Generated 2 hours ago"
            status="Ready"
            statusColor="#10B981"
          />
        </div>
      </div>
    </div>
  );
}
