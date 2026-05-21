"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
  Shield,
} from "lucide-react";
import Notifications from "@/components/shared/Notification";
import { useNotifications } from "@/components/shared/useNotifications";
import { useChatState } from "@/components/features/messages/useChatState";

import { authService } from "@/lib/api/services/auth.service";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const user = authService.getStoredUser();
    setIsAdmin(user?.role === "admin");
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Scroll down -> hide
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        if (!isOpen) {
          setIsVisible(false);
        }
      } 
      // Scroll up -> show
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  if (isMessagesPage && isChatOpen) {
    return null;
  }

  return (
    <>
      <div 
        className={`lg:hidden fixed left-0 right-0 top-0 w-full z-[60] transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-[#103B40] text-white px-4 py-4 relative z-50 shadow-md">
        
        {/* Animated Logo for Mobile - Wrapped with Link to Home */}
        <Link 
          href="/dashboard" 
          className="flex items-center gap-3 cursor-pointer active:scale-95 transition-transform"
          onClick={() => setIsOpen(false)}
        >
          <Image
            src="/images/logoSM.png"
            alt="Thalorix Logo"
            width={45}
            height={47}
            className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
            priority
          />
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
        </Link>

        {/* Icons & Menu Toggle */}
        <div className="flex items-center gap-2">
          {isMessagesPage && (
            <div className="text-white [&_button]:text-white [&_button]:hover:text-gray-200">
              <Notifications alignClass="-right-2 md:right-0 w-[300px] sm:w-80" />
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:bg-white/10 p-2 rounded-md transition-colors"
            aria-label="Toggle Menu"
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
                let isActive = pathname === item.href;
                
                if (pathname?.startsWith("/dashboard/marketplace")) {
                  if (item.label === "Marketplace") isActive = true;
                }
                
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
              {/* Admin Link (conditional) */}
              {isAdmin && (
                <Link
                  href="/dashboard/admin"
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      pathname?.startsWith("/dashboard/admin")
                        ? "bg-[#6FA5A9] text-white shadow-inner"
                        : "text-white/80 hover:bg-white/5 border border-transparent hover:border-white/10"
                    }`}
                  >
                    <Shield size={20} className={pathname?.startsWith("/dashboard/admin") ? "text-white" : "text-[#6FA5A9]"} />
                    Admin
                    <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500 text-white uppercase">
                      New
                    </span>
                  </motion.div>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      {/* Spacer to maintain layout flow since navbar is fixed */}
      <div className="h-[79px] lg:hidden w-full shrink-0" />
    </>
  );
}