"use client";

import { motion } from "framer-motion";
import { LayoutGrid, ShoppingBag, Users, Store, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type AdminTabId = "overview" | "users" | "sellers" | "products" | "reports";

interface Tab {
  id: AdminTabId;
  label: string;
  icon: React.ElementType;
  href: string;
}

export default function AdminTabs() {
  const pathname = usePathname();

  const tabs: Tab[] = [
    { id: "overview", label: "Overview", icon: LayoutGrid, href: "/dashboard/admin" },
    { id: "users", label: "Users", icon: Users, href: "/dashboard/admin/users" },
    { id: "sellers", label: "Sellers", icon: Store, href: "/dashboard/admin/sellers" },
    { id: "products", label: "Products", icon: ShoppingBag, href: "/dashboard/admin/content" },
    { id: "reports", label: "Reports", icon: TrendingUp, href: "/dashboard/admin/reports" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 mb-6 overflow-x-auto"
    >
      <div className="flex items-center gap-1 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 whitespace-nowrap outline-none"
              style={{
                color: isActive ? "#103B40" : "#6b7280",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-tab-bg"
                  className="absolute inset-0 bg-gray-100 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Icon size={16} />
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
