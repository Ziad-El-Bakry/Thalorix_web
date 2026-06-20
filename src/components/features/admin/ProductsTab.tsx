"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Check, Ban, Trash2, Eye, DollarSign, ShoppingBag, X } from "lucide-react";
import { AdminProduct } from "./adminMockData";
import { templatesService } from "@/lib/api/services/templates.service";

type Filter = "All" | "Active" | "Suspended" | "Removed";

const statusColors: Record<AdminProduct["status"], { bg: string; text: string; dot: string }> = {
  Active: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
  Suspended: { bg: "bg-red-50", text: "text-red-500", dot: "bg-red-500" },
  Removed: { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
};

export default function ProductsTab() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await templatesService.getAll();
        
        // Sort from newest to oldest
        const sortedData = data.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
          const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
          return dateB - dateA;
        });

        const mapped = sortedData.map((t: any) => {
          // Extract seller info from populated developerId or fallback
          const sellerData = t.developerId || t.seller;
          const sellerName = sellerData?.name || sellerData?.storeName || sellerData?.username || 'Unknown Seller';
          const sellerInitials = sellerName.substring(0, 2).toUpperCase();
          
          // Category info
          const categoryName = t.categoryId?.name || t.category?.name || t.category || 'Uncategorized';
          
          return {
            id: t.id || t._id,
            name: t.title || 'Untitled',
            seller: {
              name: sellerName,
              initials: sellerInitials,
              color: '#3B82F6',
            },
            price: t.price || 0,
            sales: t.sales || t.salesCount || t.downloads || 0,
            revenue: (t.sales || t.salesCount || t.downloads || 0) * (t.price || 0),
            status: t.status === 'suspended' ? 'Suspended' : t.status === 'removed' ? 'Removed' : 'Active',
            category: categoryName,
          };
        });
        setProducts(mapped as AdminProduct[]);
      } catch (err) {
        console.error("Failed to fetch templates", err);
      }
    };
    fetchTemplates();
  }, []);

  const filters: Filter[] = ["All", "Active", "Suspended", "Removed"];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesFilter = filter === "All" || p.status === filter;
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.seller.name.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [products, filter, search]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSuspend = async (id: string) => {
    try {
      await templatesService.updateStatus(id, 'suspended');
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Suspended" as const } : p)));
      showToast("Product suspended");
    } catch (e) {
      showToast("Failed to suspend product");
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await templatesService.updateStatus(id, 'active');
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Active" as const } : p)));
      showToast("Product activated");
    } catch (e) {
      showToast("Failed to activate product");
    }
  };

  const handleRemove = async (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this product?")) {
      try {
        await templatesService.delete(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        if (selectedProduct?.id === id) setSelectedProduct(null);
        showToast("Product permanently removed");
      } catch (e) {
        showToast("Failed to remove product");
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search + Filters */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products or sellers..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#103B40]/20 focus:border-[#103B40] transition-all"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  filter === f
                    ? "bg-[#103B40] text-white border-[#103B40]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
              >
                {f}
              </button>
            ))}
            <span className="text-xs text-gray-400 font-medium ml-1">{filteredProducts.length}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Seller</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Price</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Sales</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Revenue</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const sc = statusColors[product.status];
              return (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Product */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                        <ShoppingBag size={16} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  {/* Seller */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ backgroundColor: product.seller.color }}
                      >
                        {product.seller.initials}
                      </div>
                      <span className="text-sm text-gray-700">{product.seller.name}</span>
                    </div>
                  </td>
                  {/* Price */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm font-semibold text-gray-800">${product.price}</span>
                  </td>
                  {/* Sales */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-sm text-gray-600">{product.sales}</span>
                  </td>
                  {/* Revenue */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                      <DollarSign size={13} className="text-emerald-500" />
                      {product.revenue}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {product.status}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      {product.status === "Suspended" && (
                        <button
                          onClick={() => handleActivate(product.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                        >
                          <Check size={12} /> Activate
                        </button>
                      )}
                      {product.status === "Active" && (
                        <button
                          onClick={() => handleSuspend(product.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center gap-1"
                        >
                          <Ban size={12} /> Suspend
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No products found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 right-6 bg-[#103B40] text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-[200] flex items-center gap-2"
          >
            <Check size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-lg w-full relative overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#103B40]/10 flex items-center justify-center">
                    <ShoppingBag size={20} className="text-[#103B40]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Template Details</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Product overview</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                {/* Product name & category */}
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Product Name</p>
                  <p className="text-lg font-bold text-gray-900">{selectedProduct.name}</p>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                    {selectedProduct.category}
                  </span>
                </div>

                {/* Seller info */}
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Seller</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: selectedProduct.seller.color }}
                    >
                      {selectedProduct.seller.initials}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{selectedProduct.seller.name}</span>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-3.5 text-center border border-gray-100">
                    <p className="text-xs text-gray-400 font-medium mb-1">Price</p>
                    <p className="text-lg font-bold text-gray-900">${selectedProduct.price}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3.5 text-center border border-gray-100">
                    <p className="text-xs text-gray-400 font-medium mb-1">Sales</p>
                    <p className="text-lg font-bold text-gray-900">{selectedProduct.sales}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3.5 text-center border border-gray-100">
                    <p className="text-xs text-gray-400 font-medium mb-1">Revenue</p>
                    <p className="text-lg font-bold text-emerald-600">${selectedProduct.revenue}</p>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Status</p>
                  {(() => {
                    const sc = statusColors[selectedProduct.status];
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${sc.bg} ${sc.text}`}>
                        <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                        {selectedProduct.status}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-5 py-2.5 bg-[#103B40] text-white rounded-xl text-xs font-bold hover:bg-[#1b5c63] transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
