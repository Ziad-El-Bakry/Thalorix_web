"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
//import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import MobileNavbar from "@/components/layout/MobileNavbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* Mobile Navbar */}
        <MobileNavbar />

        <div className="flex-1 p-4 md:p-6 lg:p-10 w-full">
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
