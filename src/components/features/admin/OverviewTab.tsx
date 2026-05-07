"use client";

import { motion } from "framer-motion";
import { FileText, Flag, ShoppingCart, DollarSign } from "lucide-react";
import AdminStatCard from "./AdminStatCard";
import AdminActivityItem from "./AdminActivityItem";
import {
  mockStats,
  mockFlaggedPosts,
  mockPendingOrders,
  mockRestrictedUsers,
  mockRecentActivity,
} from "./adminMockData";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function OverviewTab() {
  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col gap-6">
      {/* Stat Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          icon={<FileText size={20} className="text-[#103B40]" />}
          iconBg="#103B40"
          value={mockStats.totalPosts}
          label="Total Posts"
          subtitle={`${mockStats.publishedPosts} published`}
        />
        <AdminStatCard
          icon={<Flag size={20} className="text-red-500" />}
          iconBg="#ef4444"
          value={mockStats.flaggedPosts}
          label="Flagged Posts"
          subtitle="Needs review"
        />
        <AdminStatCard
          icon={<ShoppingCart size={20} className="text-[#103B40]" />}
          iconBg="#103B40"
          value={mockStats.totalOrders}
          label="Total Orders"
          subtitle={`${mockStats.completedOrders} completed`}
        />
        <AdminStatCard
          icon={<DollarSign size={20} className="text-amber-600" />}
          iconBg="#f59e0b"
          value={mockStats.revenue}
          prefix="$"
          label="Revenue"
          subtitle="From completed orders"
        />
      </motion.div>

      {/* Three Cards Row */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Flagged Posts */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">Flagged Posts</h3>
            <span className="text-xs text-gray-400">{mockFlaggedPosts.length} need review</span>
          </div>
          <div className="space-y-3">
            {mockFlaggedPosts.map((post) => (
              <div key={post.id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: post.color }}
                >
                  {post.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-800 font-medium truncate">{post.title}</p>
                  <p className="text-xs text-gray-400">by {post.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">Pending Orders</h3>
            <span className="text-xs text-gray-400">{mockPendingOrders.length} awaiting action</span>
          </div>
          <div className="space-y-3">
            {mockPendingOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: order.color }}
                >
                  {order.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-800 font-medium truncate">{order.product}</p>
                  <p className="text-xs text-gray-400">
                    by {order.buyer} · {order.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restricted Users */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">Restricted Users</h3>
            <span className="text-xs text-gray-400">{mockRestrictedUsers.length} with limited access</span>
          </div>
          <div className="space-y-3">
            {mockRestrictedUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: user.color }}
                >
                  {user.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-800 font-medium">{user.name}</p>
                  <div className="flex gap-1.5 mt-0.5">
                    {user.restrictions.map((r) => (
                      <span key={r} className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
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

      {/* Recent Activity */}
      <motion.div variants={item} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div>
          {mockRecentActivity.map((activity) => (
            <AdminActivityItem
              key={activity.id}
              icon={activity.icon}
              iconBg={activity.iconBg}
              message={activity.message}
              time={activity.time}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
