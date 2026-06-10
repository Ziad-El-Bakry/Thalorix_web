"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
//import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import MobileNavbar from "@/components/layout/MobileNavbar";
import NavigationLoader from "@/components/layout/NavigationLoader";
import RoleGuard from "@/components/providers/RoleGuard";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <RoleGuard>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Sidebar Desktop */}
        <Sidebar />

        {/* Main Area */}
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen max-w-full overflow-clip">
          {/* Mobile Navbar */}
          <MobileNavbar />

          <div className="flex-1 p-4 md:p-6 lg:p-10 w-full">
            <NavigationLoader>
              {children}
            </NavigationLoader>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
