"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authService } from "@/lib/api/services/auth.service";
import AdminPanelHeader from "@/components/features/admin/AdminPanelHeader";
import AdminTabs, { AdminTabId } from "@/components/features/admin/AdminTabs";
import OverviewTab from "@/components/features/admin/OverviewTab";
import PostsTab from "@/components/features/admin/PostsTab";
import ProductsTab from "@/components/features/admin/ProductsTab";
import UsersTab from "@/components/features/admin/UsersTab";
import SellersTab from "@/components/features/admin/SellersTab";
import { mockStats, mockPosts, mockProducts } from "@/components/features/admin/adminMockData";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTabId>("overview");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = authService.getStoredUser();
    if (!user || user.role !== "admin") {
      router.push("/dashboard");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-[#103B40] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Verifying admin access...</p>
        </motion.div>
      </div>
    );
  }

  const flaggedCount = mockPosts.filter((p) => p.status === "Flagged").length;
  const pendingProductCount = mockProducts.filter(
    (p) => p.status === "Pending Review"
  ).length;

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-12">
      <AdminPanelHeader flaggedCount={flaggedCount} />
      <AdminTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        postCount={flaggedCount}
        productCount={pendingProductCount}
      />

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "sellers" && <SellersTab />}
        {activeTab === "posts" && <PostsTab />}
        {activeTab === "products" && <ProductsTab />}
      </motion.div>
    </div>
  );
}
