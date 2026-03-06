"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  MessageSquare,
  Users,
  Sparkles,
  Store,
  User,
} from "lucide-react";

const NAV = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Message", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Community", href: "/dashboard/community", icon: Users },
  { label: "AI Tools", href: "/dashboard/ai-generator", icon: Sparkles },
  { label: "Marketplace", href: "/dashboard/marketplace", icon: Store },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed left-0 top-0 h-screen w-64 bg-[#103B40] text-white p-6 flex flex-col lg:flex"
      style={{
        backgroundColor: "#103B40",
        //border: "4px solid #6FA5A9",
        borderRadius: "8px",
      }}
    >
      {/* Logo */}

      <div className="mb-10 text-center">
        <h1 className="text-white text-2xl font-semibold tracking-widest">
          THALORIX
        </h1>
        <div className="h-px bg-[#6FA5A9] mt-3 opacity-60"></div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-3">
          {NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all`}
                    style={{
                      backgroundColor: isActive ? "#E5E7EB" : "transparent",
                      color: isActive ? "#103B40" : "rgba(255,255,255,0.85)",
                    }}
                  >
                    <Icon size={16} />
                    {item.label}
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.aside>
  );
}
