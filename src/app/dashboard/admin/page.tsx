"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authService } from "@/lib/api/services/auth.service";
import AdminPanelHeader from "@/components/features/admin/AdminPanelHeader";
import AdminTabs from "@/components/features/admin/AdminTabs";
import OverviewTab from "@/components/features/admin/OverviewTab";

export default function AdminPage() {
  const router = useRouter();
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

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-12">
      <AdminPanelHeader />
      <AdminTabs />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <OverviewTab />
      </motion.div>
    </div>
  );
}
