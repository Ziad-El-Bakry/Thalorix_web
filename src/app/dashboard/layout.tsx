"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
//import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Navbar */}

        <div className="p-6 md:p-10">
          {/* <AnimatePresence mode="wait">
            <motion.div
              // key={pathname}
              // initial={{ opacity: 0, y: 20 }}
              // animate={{ opacity: 1, y: 0 }}
              // exit={{ opacity: 0, y: -15 }}
              // transition={{ duration: 0.3 }}
            > */}
          {children}
          {/* </motion.div>
          </AnimatePresence> */}
        </div>
      </div>
    </div>
  );
}
