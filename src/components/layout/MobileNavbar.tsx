"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  MessageSquare,
  Users,
  Sparkles,
  Store,
  User,
  Menu,
  X,
} from "lucide-react";
import Notifications from "@/components/shared/Notification";
import { useNotifications } from "@/components/shared/useNotifications";
import { useChatState } from "@/components/features/messages/useChatState";

const NAV = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Message", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Community", href: "/dashboard/community", icon: Users },
  { label: "AI Tools", href: "/dashboard/ai-generator", icon: Sparkles },
  { label: "Marketplace", href: "/dashboard/marketplace", icon: Store },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isMessagesPage = pathname?.includes("/messages");
  const { hasUnreadMessages, markMessagesRead } = useNotifications();
  const { isChatOpen } = useChatState();

  if (isMessagesPage && isChatOpen) {
    return null;
  }

  return (
    <div className="lg:hidden sticky top-0 z-[60]">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-[#103B40] text-white px-4 py-4 relative z-50 shadow-md">
        
        {/* Animated Logo for Mobile */}
        <motion.h1 
          className="text-xl font-semibold tracking-widest flex"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            },
          }}
        >
          {"THALORIX".split("").map((char, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { color: "#ffffff", opacity: 0 },
                visible: {
                  color: ["#ffffff", "#9EC8FF", "#ffffff"],
                  opacity: 1,
                  transition: {
                    color: { 
                      duration: 2.5, 
                      repeat: Infinity,   
                      ease: "linear",
                      delay: index * 0.15 
                    },
                  },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <div className="flex items-center gap-2">
          {isMessagesPage && (
            <div className="text-white [&_button]:text-white [&_button]:hover:text-gray-200">
              <Notifications alignClass="-right-2 md:right-0 w-[300px] sm:w-80" />
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:bg-white/10 p-2 rounded-md transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-[#103B40] border-t border-white/5 overflow-hidden absolute w-full z-40 shadow-xl"
          >
            <nav className="flex flex-col px-4 py-4 space-y-2 text-white">
              {NAV.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setIsOpen(false);
                      if (item.label === "Message") {
                        markMessagesRead();
                      }
                    }}
                  >
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? "bg-[#6FA5A9] text-white shadow-inner" 
                          : "text-white/80 hover:bg-white/5 border border-transparent hover:border-white/10"
                      }`}
                    >
                      <Icon size={20} className={isActive ? "text-white" : "text-[#6FA5A9]"} />
                      {item.label}
                      {item.label === "Message" && hasUnreadMessages && (
                        <span className="ml-auto w-2 h-2 bg-red-500 rounded-full border border-transparent shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}