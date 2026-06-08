"use client";

import { motion } from "framer-motion";
import { FileText, ShoppingCart, DollarSign, Users, Store, TrendingUp } from "lucide-react";
import AdminStatCard from "./AdminStatCard";
import { useState, useEffect } from "react";
import { usersService } from "@/lib/api/services/users.service";
import { api } from "@/lib/api/axios";

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
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSellers: 0,
    totalTemplates: 0,
    monthlyRevenue: 0,
  });
  const [restrictedUsers, setRestrictedUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all users to get total count and restricted users
        let totalUsersCount = 0;
        let blockedUsers: any[] = [];
        try {
          const usersData = await usersService.getAllUsers({ limit: 1000 });
          const allUsers = usersData.users || [];
          totalUsersCount = usersData.total || allUsers.length;
          blockedUsers = allUsers.filter((u: any) => u.isBlocked);
          setRestrictedUsers(blockedUsers);
        } catch (e) {
          console.error("Failed to fetch users", e);
        }

        // Fetch sellers
        let totalSellers = 0;
        try {
          const sellersRes = await api.get('/seller');
          totalSellers = sellersRes.data?.total || sellersRes.data?.data?.length || sellersRes.data?.length || 0;
        } catch (e) {
          console.error("Failed to fetch sellers", e);
        }

        // Fetch templates
        let totalTemplates = 0;
        try {
          const templatesRes = await api.get('/templates');
          totalTemplates = templatesRes.data?.total || templatesRes.data?.data?.length || templatesRes.data?.length || 0;
        } catch (e) {
          console.error("Failed to fetch templates", e);
        }

        setStats({
          totalUsers: totalUsersCount,
          activeSellers: totalSellers,
          totalTemplates: totalTemplates,
          monthlyRevenue: 24800, // Still mocked as there's no global revenue API
        });
      } catch (error) {
        console.error("Error fetching overview data", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col gap-6">
      {/* Top Stat Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          icon={<Users size={20} className="text-blue-600" />}
          iconBg="#3B82F6"
          value={stats.totalUsers}
          label="Total Users"
          subtitle="Registered accounts"
          live={true}
        />
        <AdminStatCard
          icon={<Store size={20} className="text-emerald-600" />}
          iconBg="#10B981"
          value={stats.activeSellers}
          label="Active Sellers"
          subtitle="Verified stores"
          live={true}
        />
        <AdminStatCard
          icon={<FileText size={20} className="text-violet-600" />}
          iconBg="#8B5CF6"
          value={stats.totalTemplates}
          label="Total Templates"
          subtitle="Available in marketplace"
          live={true}
        />
        <AdminStatCard
          icon={<DollarSign size={20} className="text-amber-600" />}
          iconBg="#F59E0B"
          value={stats.monthlyRevenue}
          prefix="$"
          label="Monthly Revenue"
          subtitle="From completed orders"
          live={false}
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
              {restrictedUsers.length} limited
            </span>
          </div>
          <div className="space-y-3 overflow-y-auto flex-1 pr-2 sidebar-scrollbar max-h-[250px]">
            {restrictedUsers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center mt-10">No restricted users found.</p>
            ) : (
              restrictedUsers.map((user) => (
                <div key={user.id || user._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm bg-gray-800"
                  >
                    {(user.name || user.username || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-800 font-bold truncate">{user.name || user.username}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-wider border border-red-100">
                        BANNED
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
