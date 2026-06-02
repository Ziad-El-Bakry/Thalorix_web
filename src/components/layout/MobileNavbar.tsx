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
  Settings,
  LayoutDashboard,
  Package,
  Upload,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import Notifications from "@/components/shared/Notification";
import { useNotifications } from "@/components/shared/useNotifications";
import { useChatState } from "@/components/features/messages/useChatState";
import { authService } from "@/lib/api/services/auth.service";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
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

function isRouteActive(pathname: string | null, href: string, label: string): boolean {
  if (!pathname) return false;
  if (href === "/dashboard" && label === "Home") return pathname === "/dashboard";
  if (label === "Marketplace") return pathname.startsWith("/dashboard/marketplace");
  if (href === "/dashboard/seller/dashboard") return pathname === "/dashboard/seller/dashboard";
  if (href === "/dashboard/seller/products") return pathname.startsWith("/dashboard/seller/products");
  if (href === "/dashboard/seller/earnings") return pathname.startsWith("/dashboard/seller/earnings");
  if (href === "/dashboard/marketplace/upload") return pathname === "/dashboard/marketplace/upload";
  if (label === "Community") {
    if (pathname === "/dashboard/community") return true;
    if (pathname.startsWith("/dashboard/profile/") && pathname !== "/dashboard/profile") return true;
    return false;
  }
  if (label === "Profile") {
    return pathname === "/dashboard/profile" || pathname === "/dashboard/seller/profile";
  }
  if (label === "Settings") return pathname === "/dashboard/settings";
  if (label === "Admin Panel") return pathname.startsWith("/dashboard/admin");
  return pathname.startsWith(href);
}

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isMessagesPage = pathname?.includes("/messages");
  const { hasUnreadMessages, markMessagesRead } = useNotifications();
  const { isChatOpen } = useChatState();
  const [userRole, setUserRole] = useState<string>("user");
  const [userName, setUserName] = useState("User");
  const [isVisible, setIsVisible] = useState(true);

  const isSeller = userRole === "seller";
  const isAdmin = userRole === "admin";

  useEffect(() => {
    const user = authService.getStoredUser();
    if (user) {
      setUserRole(user.role || "user");
      setUserName(user.name || user.username || "User");
    }
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        if (!isOpen) setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  if (isMessagesPage && isChatOpen) return null;

  const profileHref = isSeller ? "/dashboard/seller/profile" : "/dashboard/profile";

  const roleBadge = {
    user: { label: "User", color: "#3B82F6" },
    seller: { label: "Seller", color: "#10B981" },
    admin: { label: "Admin", color: "#F59E0B" },
  }[userRole] || { label: "User", color: "#3B82F6" };

  return (
    <>
      <div
        className={`lg:hidden fixed left-0 right-0 top-0 w-full z-[60] transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between bg-[#103B40] text-white px-4 py-4 relative z-50 shadow-md">
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
                visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
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
                        color: { duration: 2.5, repeat: Infinity, ease: "linear", delay: index * 0.15 },
                      },
                    },
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          </Link>

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
              <nav className="flex flex-col px-4 py-3 space-y-1 text-white max-h-[75vh] overflow-y-auto sidebar-scrollbar pr-1">
                {/* User Info */}
                <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl bg-white/5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{userName}</p>
                    <span className="text-[10px] font-bold uppercase" style={{ color: roleBadge.color }}>
                      {roleBadge.label}
                    </span>
                  </div>
                </div>

                {/* Section: Main */}
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/35 px-3 pt-2 pb-1">Main</p>
                {MAIN_NAV.map((item) => {
                  const active = isRouteActive(pathname, item.href, item.label);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        setIsOpen(false);
                        if (item.label === "Messages") markMessagesRead();
                      }}
                    >
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          active
                            ? "bg-white/10 text-white border-l-[3px] border-[#43B0B5]"
                            : "text-white/70 hover:bg-white/5 border-l-[3px] border-transparent"
                        }`}
                      >
                        <Icon size={20} className={active ? "text-[#43B0B5]" : "text-white/50"} />
                        {item.label}
                        {item.label === "Messages" && hasUnreadMessages && (
                          <span className="ml-auto w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}

                {/* Section: Seller Tools */}
                {isSeller && (
                  <>
                    <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/35 px-3 pt-3 pb-1">Seller Tools</p>
                    {SELLER_NAV.map((item) => {
                      const active = isRouteActive(pathname, item.href, item.label);
                      const Icon = item.icon;
                      return (
                        <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                          <motion.div
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                              active
                                ? "bg-white/10 text-white border-l-[3px] border-[#43B0B5]"
                                : "text-white/70 hover:bg-white/5 border-l-[3px] border-transparent"
                            }`}
                          >
                            <Icon size={20} className={active ? "text-[#43B0B5]" : "text-white/50"} />
                            {item.label}
                          </motion.div>
                        </Link>
                      );
                    })}
                  </>
                )}

                {/* Section: Admin */}
                {isAdmin && (
                  <>
                    <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/35 px-3 pt-3 pb-1">Administration</p>
                    <Link href="/dashboard/admin" onClick={() => setIsOpen(false)}>
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          pathname?.startsWith("/dashboard/admin")
                            ? "bg-white/10 text-white border-l-[3px] border-[#43B0B5]"
                            : "text-white/70 hover:bg-white/5 border-l-[3px] border-transparent"
                        }`}
                      >
                        <Shield size={20} className={pathname?.startsWith("/dashboard/admin") ? "text-[#43B0B5]" : "text-white/50"} />
                        Admin Panel
                      </motion.div>
                    </Link>
                  </>
                )}

                {/* Become a Seller CTA */}
                {userRole === "user" && (
                  <Link href="/dashboard/become-seller" onClick={() => setIsOpen(false)}>
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 px-4 py-3 mt-1 rounded-xl text-sm font-medium"
                      style={{
                        background: "linear-gradient(135deg, #134e54 0%, #1a6b6e 50%, #0d3a3d 100%)",
                        border: "1px solid rgba(67,176,181,0.25)",
                      }}
                    >
                      <Store size={18} className="text-[#43B0B5]" />
                      <span className="text-white/90">Become a Seller</span>
                      <ArrowUpRight size={14} className="ml-auto text-[#43B0B5]" />
                    </motion.div>
                  </Link>
                )}

                {/* Divider */}
                <div className="h-px bg-white/10 my-2 mx-3" />

                {/* Bottom: Profile + Settings */}
                <Link href={profileHref} onClick={() => setIsOpen(false)}>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isRouteActive(pathname, profileHref, "Profile")
                        ? "bg-white/10 text-white border-l-[3px] border-[#43B0B5]"
                        : "text-white/70 hover:bg-white/5 border-l-[3px] border-transparent"
                    }`}
                  >
                    <User size={20} className={isRouteActive(pathname, profileHref, "Profile") ? "text-[#43B0B5]" : "text-white/50"} />
                    Profile
                  </motion.div>
                </Link>
                <Link href="/dashboard/settings" onClick={() => setIsOpen(false)}>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      pathname === "/dashboard/settings"
                        ? "bg-white/10 text-white border-l-[3px] border-[#43B0B5]"
                        : "text-white/70 hover:bg-white/5 border-l-[3px] border-transparent"
                    }`}
                  >
                    <Settings size={20} className={pathname === "/dashboard/settings" ? "text-[#43B0B5]" : "text-white/50"} />
                    Settings
                  </motion.div>
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Spacer */}
      <div className="h-[79px] lg:hidden w-full shrink-0" />
    </>
  );
}