"use client";

import UserHeader from "@/components/ui/UserHeader";
import TemplateList from "@/components/features/marketplace/shared/TemplateList";
import { Search, Filter, LayoutGrid, Upload, ShoppingCart, History } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { authService } from "@/lib/api/services/auth.service";
import { templatesService } from "@/lib/api/services/templates.service";
import { Template } from "@/types";

export default function MarketplacePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [isSeller, setIsSeller] = useState(false);
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    const user = authService.getStoredUser() as any;
    if (user) {
      setUserName((user?.name || user?.username)?.split(' ')[0] || "User");
      if (user?.role === 'seller') {
        setIsSeller(true);
      }
    }

    const fetchTemplates = async () => {
      try {
        const data = await templatesService.getAll();
        const sortedData = data.sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setTemplates(sortedData);
      } catch (err) {
        console.error("Failed to load templates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  return (
    <div className="-m-4 md:-m-6 lg:-m-10 p-4 md:p-6 lg:p-10 bg-[#E2E3EA] dark:bg-gray-950 min-h-[calc(100vh-60px)]">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col h-full">
        <div className="border-b-2 border-[#b0c4c4] dark:border-gray-800 pb-2 mb-4 relative z-50">
          <UserHeader name={userName} compact={true} />
        </div>

        {/* Header Actions */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-between items-center gap-4 mt-2 mb-2"
        >
          <div className="flex-1">
            <h2 className="text-[#103B40] dark:text-[#43B0B5] font-bold text-2xl">All Templates</h2>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/marketplace/history"
              className="flex items-center gap-2 bg-white dark:bg-gray-900 text-[#123E41] dark:text-gray-200 px-4 py-3.5 rounded-xl transition-colors font-medium text-sm shadow-sm border border-teal-50 dark:border-gray-700 hover:bg-teal-50 dark:hover:bg-gray-800"
            >
              <History size={18} />
              <span className="hidden sm:inline">History</span>
            </Link>
            <Link
              href="/dashboard/marketplace/cart"
              className="flex items-center gap-2 bg-white dark:bg-gray-900 text-[#123E41] dark:text-gray-200 px-4 py-3.5 rounded-xl transition-colors font-medium text-sm shadow-sm border border-teal-50 dark:border-gray-700 hover:bg-teal-50 dark:hover:bg-gray-800 relative"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            {isSeller && (
              <Link
                href="/dashboard/marketplace/upload"
                className="flex items-center gap-2 bg-[#123E41] hover:bg-[#0d2c2e] text-white px-4 py-3.5 rounded-xl transition-colors font-medium text-sm ml-2 shadow-sm"
              >
                <Upload size={18} />
                <span className="hidden sm:inline">Upload Template</span>
              </Link>
            )}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-[#123E41] dark:text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#123E41]"></div>
          </div>
        ) : (
          <TemplateList templates={templates} />
        )}
      </div>
    </div>
  );
}