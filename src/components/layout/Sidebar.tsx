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
import { useNotifications } from "@/components/shared/useNotifications";

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
  const { hasUnreadMessages, markMessagesRead } = useNotifications();

  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed left-0 top-0 h-screen w-64 bg-[#103B40] text-white p-6 hidden lg:flex flex-col z-50"
      style={{
        backgroundColor: "#103B40",
        borderRadius: "0px",
      }}
    >
      {/* Logo */}

      <div className="mb-10 text-center">
        <motion.h1
          className="text-white text-2xl font-semibold tracking-widest flex justify-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
        >
          {"THALORIX".split("").map((char, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { color: "#ffffff", opacity: 0, y: -10 },
                visible: {
                  color: ["#ffffff", "#9EC8FF", "#ffffff"],
                  opacity: 1,
                  y: 0,
                  transition: {
                    color: { duration: 2, repeat: Infinity, delay: index * 0.2 },
                    y: { duration: 0.4 },
                    opacity: { duration: 0.4 }
                  },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 0.6 }}
          transition={{ duration: 1, delay: 1 }}
          className="h-px bg-[#6FA5A9] mt-3 mx-auto"
        ></motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-3">
          {NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  onClick={() => {
                    if (item.label === "Message") {
                      markMessagesRead();
                    }
                  }}
                >
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all`}
                    style={{
                      backgroundColor: isActive ? "#E5E7EB" : "transparent",
                      color: isActive ? "#103B40" : "rgba(255,255,255,0.85)",
                    }}
                  >
                    <Icon size={18} />
                    {item.label}
                    {item.label === "Message" && hasUnreadMessages && (
                      <span className="ml-auto w-2 h-2 bg-red-500 rounded-full border border-transparent shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                    )}
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
