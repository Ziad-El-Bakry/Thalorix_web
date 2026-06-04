"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, User } from "@/lib/api/services/auth.service";
import DashboardHeader from "@/components/features/dashboard/DashboardHeader";
import UserDashboardContent from "@/components/features/dashboard/UserDashboardContent";
import SellerDashboardContent from "@/components/features/dashboard/SellerDashboardContent";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      if (storedUser.role === "admin") {
        router.replace("/dashboard/admin");
      }
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#103B40] border-t-transparent" />
      </div>
    );
  }

  const renderDashboardContent = () => {
    switch (user?.role) {
      case "seller":
        return <SellerDashboardContent user={user} />;
      case "user":
      default:
        return <UserDashboardContent user={user} />;
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-12">
      <DashboardHeader user={user} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={user?.role || "user"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderDashboardContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
