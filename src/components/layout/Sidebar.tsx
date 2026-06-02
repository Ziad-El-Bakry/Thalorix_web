"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  MessageSquare,
  Users,
  Sparkles,
  Store,
  User,
  Shield,
} from "lucide-react";
import { useNotifications } from "@/components/shared/useNotifications";
import { useEffect, useState } from "react";
import { authService } from "@/lib/api/services/auth.service";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    const user = authService.getStoredUser();
    setIsAdmin(user?.role === "admin");
    setIsSeller(user?.role === "seller");
  }, []);
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
<Link href="/dashboard" className="block cursor-pointer group"> 
  <div className="mb-10 text-center flex flex-col items-center">
    <Image
      src="/images/logoSM.png"
      alt="Thalorix Logo"
      width={70}
      height={60}
      className="object-contain mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-transform group-hover:scale-105"
      priority
    />
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
</Link>
      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-3">
          {NAV.map((item) => {
            let itemHref = item.href;
            if (item.label === "Profile" && isSeller) {
              itemHref = "/dashboard/seller/profile";
            }

            let isActive = pathname === itemHref;
            
            // If viewing another person's profile, highlight Community instead of Profile
            if (pathname?.startsWith("/dashboard/profile/") && pathname !== "/dashboard/profile") {
              if (item.label === "Community") isActive = true;
              if (item.label === "Profile") isActive = false;
            }

            if (pathname?.startsWith("/dashboard/seller/") && pathname !== "/dashboard/seller/profile") {
              if (item.label === "Community") isActive = true;
              if (item.label === "Profile") isActive = false;
            }
 
            // If viewing marketplace related pages, highlight Marketplace
            if (pathname?.startsWith("/dashboard/marketplace")) {
              if (item.label === "Marketplace") isActive = true;
            }
 
            const Icon = item.icon;
 
            return (
              <li key={itemHref}>
                <Link 
                  href={itemHref}
                  className="block focus:outline-none focus-visible:outline-none outline-none"
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
        {/* Admin Link (conditional) */}
        {isAdmin && (
          <div className="mt-3">
            <Link
              href="/dashboard/admin"
              className="block focus:outline-none focus-visible:outline-none outline-none"
            >
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: pathname?.startsWith("/dashboard/admin") ? "#E5E7EB" : "transparent",
                  color: pathname?.startsWith("/dashboard/admin") ? "#103B40" : "rgba(255,255,255,0.85)",
                }}
              >
                <Shield size={18} />
                Admin
                <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500 text-white uppercase">
                  New
                </span>
              </motion.div>
            </Link>
          </div>
        )}
      </nav>
    </motion.aside>
  );
}
