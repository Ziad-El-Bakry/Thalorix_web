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
  Settings,
  LayoutDashboard,
  Package,
  Upload,
  DollarSign,
  Heart,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import { useNotifications } from "@/components/shared/useNotifications";
import { useEffect, useState } from "react";
import { authService } from "@/lib/api/services/auth.service";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Community", href: "/dashboard/community", icon: Users },
  { label: "Marketplace", href: "/dashboard/marketplace", icon: Store },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "AI Tools", href: "/dashboard/ai-generator", icon: Sparkles },
];

const SELLER_NAV: NavItem[] = [
  { label: "Seller Dashboard", href: "/dashboard/seller/dashboard", icon: LayoutDashboard },
  { label: "My Products", href: "/dashboard/seller/products", icon: Package },
  { label: "Upload Template", href: "/dashboard/marketplace/upload", icon: Upload },
  { label: "Earnings", href: "/dashboard/seller/earnings", icon: DollarSign },
];

const BOTTOM_NAV: NavItem[] = [
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-4 pt-5 pb-1.5">
      <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/40">
        {label}
      </span>
    </div>
  );
}

function NavLink({
  item,
  isActive,
  hasUnread,
  onMessageClick,
}: {
  item: NavItem;
  isActive: boolean;
  hasUnread?: boolean;
  onMessageClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        className="block focus:outline-none focus-visible:outline-none outline-none"
        onClick={() => {
          if (item.label === "Messages" && onMessageClick) {
            onMessageClick();
          }
        }}
      >
        <motion.div
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            backgroundColor: isActive ? "rgba(255,255,255,0.12)" : "transparent",
            color: isActive ? "#ffffff" : "rgba(255,255,255,0.65)",
            borderLeft: isActive ? "3px solid #43B0B5" : "3px solid transparent",
          }}
        >
          <Icon size={18} className={isActive ? "text-[#43B0B5]" : ""} />
          <span className="flex-1">{item.label}</span>
          {item.label === "Messages" && hasUnread && (
            <span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          )}
          {item.badge && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500 text-white uppercase">
              {item.badge}
            </span>
          )}
        </motion.div>
      </Link>
    </li>
  );
}

function isRouteActive(pathname: string | null, href: string, label: string): boolean {
  if (!pathname) return false;

  // Exact match for home
  if (href === "/dashboard" && label === "Home") return pathname === "/dashboard";

  // Marketplace routes
  if (label === "Marketplace") return pathname.startsWith("/dashboard/marketplace");

  // Seller dashboard routes
  if (href === "/dashboard/seller/dashboard") return pathname === "/dashboard/seller/dashboard";
  if (href === "/dashboard/seller/products") return pathname.startsWith("/dashboard/seller/products");
  if (href === "/dashboard/seller/earnings") return pathname.startsWith("/dashboard/seller/earnings");

  // Upload template
  if (href === "/dashboard/marketplace/upload") return pathname === "/dashboard/marketplace/upload";

  // Community — also active when viewing someone else's profile
  if (label === "Community") {
    if (pathname === "/dashboard/community") return true;
    if (pathname.startsWith("/dashboard/profile/") && pathname !== "/dashboard/profile") return true;
    if (pathname.startsWith("/dashboard/seller/") && 
        pathname !== "/dashboard/seller/profile" && 
        !pathname.startsWith("/dashboard/seller/dashboard") &&
        !pathname.startsWith("/dashboard/seller/products") &&
        !pathname.startsWith("/dashboard/seller/earnings") &&
        !pathname.startsWith("/dashboard/seller/settings")) return true;
    return false;
  }

  // Profile
  if (label === "Profile") {
    if (pathname === "/dashboard/profile" || pathname === "/dashboard/seller/profile") return true;
    return false;
  }

  // Settings
  if (label === "Settings") return pathname === "/dashboard/settings";

  // Admin
  if (label === "Admin Panel") return pathname.startsWith("/dashboard/admin");

  // Generic prefix match
  return pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();
  const { hasUnreadMessages, markMessagesRead } = useNotifications();
  const [userRole, setUserRole] = useState<string>("user");
  const [userName, setUserName] = useState("User");
  const [userAvatar, setUserAvatar] = useState("/images/avatar.png");

  useEffect(() => {
    const user = authService.getStoredUser();
    if (user) {
      setUserRole(user.role || "user");
      setUserName(user.name || user.username || "User");
      if (user.avatar) setUserAvatar(user.avatar);
    }
  }, []);

  const isSeller = userRole === "seller";
  const isAdmin = userRole === "admin";

  // Adjust profile href for seller
  const bottomNav = BOTTOM_NAV.map((item) => {
    if (item.label === "Profile" && isSeller) {
      return { ...item, href: "/dashboard/seller/profile" };
    }
    return item;
  });

  const roleBadge = {
    user: { label: "User", color: "#3B82F6", bg: "rgba(59,130,246,0.15)" },
    seller: { label: "Seller", color: "#10B981", bg: "rgba(16,185,129,0.15)" },
    admin: { label: "Admin", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
  }[userRole] || { label: "User", color: "#3B82F6", bg: "rgba(59,130,246,0.15)" };

  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed left-0 top-0 h-screen w-64 text-white hidden lg:flex flex-col z-50"
      style={{ backgroundColor: "#103B40" }}
    >
      {/* Logo */}
      <Link href="/dashboard" className="block cursor-pointer group">
        <div className="pt-6 pb-4 text-center flex flex-col items-center px-6">
          <Image
            src="/images/logoSM.png"
            alt="Thalorix Logo"
            width={60}
            height={52}
            className="object-contain mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-transform group-hover:scale-105"
            priority
          />
          <motion.h1
            className="text-white text-xl font-semibold tracking-widest flex justify-center"
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
                      opacity: { duration: 0.4 },
                    },
                  },
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
        </div>
      </Link>

      {/* Divider */}
      <div className="mx-6 h-px bg-white/10" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 sidebar-scrollbar pr-1">
        {/* Main Section */}
        <SectionLabel label="Main" />
        <ul className="space-y-0.5">
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={isRouteActive(pathname, item.href, item.label)}
              hasUnread={item.label === "Messages" ? hasUnreadMessages : false}
              onMessageClick={markMessagesRead}
            />
          ))}
        </ul>

        {/* Seller Tools Section */}
        {isSeller && (
          <>
            <SectionLabel label="Seller Tools" />
            <ul className="space-y-0.5">
              {SELLER_NAV.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={isRouteActive(pathname, item.href, item.label)}
                />
              ))}
            </ul>
          </>
        )}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <SectionLabel label="Administration" />
            <ul className="space-y-0.5">
              <NavLink
                item={{ label: "Admin Panel", href: "/dashboard/admin", icon: Shield }}
                isActive={isRouteActive(pathname, "/dashboard/admin", "Admin Panel")}
              />
            </ul>
          </>
        )}

        {/* Become a Seller CTA — only for regular users */}
        {userRole === "user" && (
          <div className="mx-2 mt-5">
            <Link href="/dashboard/become-seller">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden rounded-xl p-3.5 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #134e54 0%, #1a6b6e 50%, #0d3a3d 100%)",
                  border: "1px solid rgba(67,176,181,0.25)",
                }}
              >
                <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-[#43B0B5] opacity-10 -translate-y-4 translate-x-4" />
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#43B0B5]/20 flex items-center justify-center">
                    <Store size={16} className="text-[#43B0B5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-white/90 leading-tight">Become a Seller</p>
                    <p className="text-[9px] text-white/50 leading-tight mt-0.5">Start selling templates</p>
                  </div>
                  <ArrowUpRight size={14} className="text-[#43B0B5] flex-shrink-0" />
                </div>
              </motion.div>
            </Link>
          </div>
        )}
      </nav>

      {/* Bottom Divider */}
      <div className="mx-6 h-px bg-white/10" />

      {/* Bottom Navigation (Profile + Settings) */}
      <div className="px-2 py-2">
        <ul className="space-y-0.5">
          {bottomNav.map((item) => (
            <NavLink
              key={item.href + item.label}
              item={item}
              isActive={isRouteActive(pathname, item.href, item.label)}
            />
          ))}
        </ul>
      </div>

      {/* User Card */}
      <div className="px-4 pb-4">
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/10">
            <Image
              src={userAvatar}
              alt={userName}
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{userName}</p>
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mt-0.5"
              style={{ color: roleBadge.color, backgroundColor: roleBadge.bg }}
            >
              {roleBadge.label}
            </span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
