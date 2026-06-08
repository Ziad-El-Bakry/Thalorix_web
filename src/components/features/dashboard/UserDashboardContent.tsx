"use client";

import { motion, Variants } from "framer-motion";
import {
  Plus,
  Sparkles,
  Settings,
  Heart,
  Store,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import TopPerformingPosts from "./TopPerformingPosts";
import type { User } from "@/lib/api/services/auth.service";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

/* ─── Shortcut Card ─── */
interface ShortcutProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
  gradient: string;
  iconBg: string;
}

function ShortcutCard({ icon, label, description, href, gradient, iconBg }: ShortcutProps) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <Link
        href={href}
        className="group relative flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:border-gray-200/80 transition-all duration-300 overflow-hidden"
      >
        {/* Accent gradient */}
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`}
        />

        {/* Icon */}
        <div
          className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg} transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>

        {/* Text */}
        <div className="relative z-10 flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 group-hover:text-gray-900 transition-colors">
            {label}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{description}</p>
        </div>

        {/* Arrow */}
        <ArrowRight
          size={16}
          className="relative z-10 text-gray-300 group-hover:text-[#103B40] transition-all duration-300 group-hover:translate-x-1 shrink-0"
        />
      </Link>
    </motion.div>
  );
}

export default function UserDashboardContent({ user }: { user: User | null }) {
  const shortcuts: ShortcutProps[] = [
    {
      icon: <Store size={22} className="text-amber-600" />,
      label: "Marketplace",
      description: "Browse & purchase templates",
      href: "/dashboard/marketplace",
      gradient: "bg-gradient-to-r from-amber-50/60 to-transparent",
      iconBg: "bg-amber-50",
    },
    {
      icon: <Plus size={22} className="text-[#43B0B5]" />,
      label: "New Post",
      description: "Share with the community",
      href: "/dashboard/community?post=new",
      gradient: "bg-gradient-to-r from-teal-50/60 to-transparent",
      iconBg: "bg-teal-50",
    },
    {
      icon: <Sparkles size={22} className="text-violet-500" />,
      label: "AI Write",
      description: "Generate content with AI",
      href: "/dashboard/ai-generator",
      gradient: "bg-gradient-to-r from-violet-50/60 to-transparent",
      iconBg: "bg-violet-50",
    },
    {
      icon: <Heart size={22} className="text-rose-500" />,
      label: "Wishlist",
      description: "Your saved templates",
      href: "/dashboard/marketplace/wishlist",
      gradient: "bg-gradient-to-r from-rose-50/60 to-transparent",
      iconBg: "bg-rose-50",
    },
    {
      icon: <MessageSquare size={22} className="text-blue-500" />,
      label: "Messages",
      description: "Chat with your connections",
      href: "/dashboard/messages",
      gradient: "bg-gradient-to-r from-blue-50/60 to-transparent",
      iconBg: "bg-blue-50",
    },
    {
      icon: <Settings size={22} className="text-gray-500" />,
      label: "Settings",
      description: "Account & preferences",
      href: "/dashboard/settings",
      gradient: "bg-gradient-to-r from-gray-50/60 to-transparent",
      iconBg: "bg-gray-100",
    },
  ];

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ─── Quick Shortcuts Grid ─── */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#103B40]" />
          <h3 className="text-xs font-bold text-gray-400 tracking-[0.15em] uppercase">
            Quick Actions
          </h3>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {shortcuts.map((shortcut, idx) => (
            <motion.div
              key={shortcut.label}
              variants={itemVariants}
            >
              <ShortcutCard {...shortcut} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── Top Posts ─── */}
      <motion.div
        variants={itemVariants}
        className="w-full"
      >
        <TopPerformingPosts />
      </motion.div>
    </motion.div>
  );
}
