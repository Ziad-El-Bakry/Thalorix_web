"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
//import MobileNavbar from "@/components/layout/MobileNavbar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Sidebar Desktop */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-[#103B40] text-white p-6 flex flex-col hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main Area */}
      <div className="flex-1 lg:ml-64">
        
        {/* Mobile Navbar */}
        {/* <MobileNavbar /> */}

        <div className="p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              // initial={{ opacity: 0, y: 20 }}
              // animate={{ opacity: 1, y: 0 }}
              // exit={{ opacity: 0, y: -15 }}
              // transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}