"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreVertical, Edit2, Trash2, Eye, EyeOff, Package, AlertCircle } from "lucide-react";
import { sellersService } from "@/lib/api/services/sellers.service";
import { User } from "@/lib/api/services/auth.service";
import Link from "next/link";
import Image from "next/image";

interface SellerProductsManagerProps {
  user: User | null;
}

export default function SellerProductsManager({ user }: SellerProductsManagerProps) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const userId = user?.id || (user as any)?._id;
        if (userId) {
          const data = await sellersService.getSellerTemplates(userId);
          setTemplates(data || []);
        }
      } catch (err) {
        console.error("Failed to load seller templates:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTemplates();
  }, [user]);

  const filteredTemplates = templates.filter((t) => 
    t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#103B40] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header & Controls */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#43B0B5]/30 focus:border-[#43B0B5] transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
            <Filter size={16} /> Filter
          </button>
          <Link href="/dashboard/marketplace/upload" className="flex-1 sm:flex-none">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#103B40] text-white rounded-xl hover:bg-[#0d2c2e] transition-colors text-sm font-medium shadow-sm">
              <Package size={16} /> New Product
            </button>
          </Link>
        </div>
      </div>

      {/* Product List */}
      {filteredTemplates.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Package size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
          <p className="text-gray-500 mb-6 max-w-sm">
            {searchQuery ? "We couldn't find any products matching your search." : "You haven't uploaded any products yet. Start selling today!"}
          </p>
          {!searchQuery && (
            <Link href="/dashboard/marketplace/upload">
              <button className="px-6 py-2.5 bg-[#43B0B5] text-white rounded-xl font-medium hover:bg-[#389b9f] transition-colors shadow-sm">
                Upload First Product
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4 rounded-tl-2xl">Product</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Sales</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4 rounded-tr-2xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTemplates.map((template, index) => (
                <motion.tr 
                  key={template.id || template._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative flex-shrink-0 border border-gray-200">
                        {template.imageUrl || template.image ? (
                          <Image src={template.imageUrl || template.image} alt={template.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{template.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{template.categoryId?.name || "Uncategorized"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${template.price}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{template.downloads || 0}</td>
                  <td className="px-6 py-4 text-gray-900 font-bold">${(template.price * (template.downloads || 0)).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Hide">
                        <EyeOff size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
