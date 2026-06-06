"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Ban, Check, Trash2, X, ChevronLeft, ChevronRight, AlertTriangle, Store } from "lucide-react";
import { sellersService, type Seller } from "@/lib/api/services/sellers.service";

export default function SellersTab() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Modals state
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: "delete" | "toggle_active";
    targetSeller: Seller | null;
    targetActiveState?: boolean;
  }>({ show: false, type: "delete", targetSeller: null });

  const [typedConfirmation, setTypedConfirmation] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch sellers
  const fetchSellers = async () => {
    setLoading(true);
    try {
      const data = await sellersService.getAllSellers({
        page,
        limit,
        search: debouncedSearch,
      });
      setSellers(data.sellers || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Error fetching sellers:", err);
      showToast("Failed to load seller list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [page, debouncedSearch]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleActionClick = (type: "delete" | "toggle_active", seller: Seller, activeState?: boolean) => {
    setTypedConfirmation("");
    setConfirmModal({
      show: true,
      type,
      targetSeller: seller,
      targetActiveState: activeState,
    });
  };

  const executeConfirmedAction = async () => {
    const { type, targetSeller, targetActiveState } = confirmModal;
    if (!targetSeller) return;
    const sellerId = targetSeller.id || targetSeller._id;

    try {
      if (type === "delete") {
        if (typedConfirmation.trim().toLowerCase() !== targetSeller.email.trim().toLowerCase()) {
          showToast("Typed email address does not match!");
          return;
        }
        await sellersService.deleteSeller(sellerId);
        showToast(`Seller ${targetSeller.name} deleted successfully (soft delete)`);
      } else if (type === "toggle_active") {
        await sellersService.updateSeller(sellerId, { isActive: targetActiveState });
        showToast(
          targetActiveState
            ? `Seller account ${targetSeller.name} activated successfully`
            : `Seller account ${targetSeller.name} deactivated`
        );
      }
      setConfirmModal({ show: false, type: "delete", targetSeller: null });
      fetchSellers();
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || "An error occurred while executing this action";
      showToast(errMsg);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-left"
      dir="ltr"
    >
      {/* Header & Search */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Seller Management</h2>
          <p className="text-xs text-gray-400 mt-1">Manage seller accounts, stores, ratings, and activation states</p>
        </div>
        <div className="relative w-full md:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by seller or store name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#103B40]/20 focus:border-[#103B40] transition-all bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 border-4 border-[#103B40] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 font-medium">Loading sellers from database...</p>
          </div>
        ) : sellers.length === 0 ? (
          <div className="text-center py-24">
            <Store size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">No registered sellers found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 font-bold">
                <th className="text-left px-6 py-4">Seller & Store Info</th>
                <th className="text-left px-6 py-4">Phone & Contact Info</th>

                <th className="text-center px-6 py-4">Account Status</th>
                <th className="text-center px-6 py-4">Verification</th>
                <th className="text-center px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => {
                const sellerId = seller.id || seller._id;
                
                return (
                  <motion.tr
                    key={sellerId}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-200"
                  >
                    {/* Seller details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-50 text-teal-600 text-sm border border-teal-100 shadow-sm font-extrabold flex-shrink-0">
                          {seller.logo ? (
                            <img src={seller.logo} alt="logo" className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <Store size={18} />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-gray-800">{seller.name}</span>
                          <span className="text-[11px] text-[#103B40] font-semibold bg-[#103B40]/5 px-2 py-0.5 rounded block mt-0.5 w-max">
                            Store: {seller.storeName || "Unspecified"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email/Phone */}
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-700 block">{seller.phone || "—"}</span>
                      <span className="text-[11px] text-gray-400 block mt-0.5">{seller.email}</span>
                    </td>



                    {/* Active toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleActionClick("toggle_active", seller, !seller.isActive)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          seller.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                        }`}
                      >
                        {seller.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Verified indicator */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          seller.isVerified
                            ? "bg-teal-50 text-teal-600 border border-teal-100"
                            : "bg-gray-50 text-gray-400 border border-gray-100"
                        }`}
                      >
                        {seller.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>

                    {/* Delete button */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleActionClick("delete", seller)}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                        title="Delete Seller"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all"
          >
            <ChevronLeft size={14} />
            <span>Prev</span>
          </button>
          <span className="text-xs text-gray-500 font-medium">
            Page {page} of {totalPages} (Total {total} sellers)
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-[#103B40] text-white px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold z-[500] flex items-center gap-2 border border-[#1b5c63]"
          >
            <Check size={16} className="text-emerald-400" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Typed Confirmation Modal for Sellers */}
      <AnimatePresence>
        {confirmModal.show && confirmModal.targetSeller && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 max-w-md w-full relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setConfirmModal({ show: false, type: "delete", targetSeller: null })}
                  className="p-1 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center gap-3 text-red-500 mb-4">
                <AlertTriangle size={28} className="text-red-600 animate-pulse" />
                <h3 className="text-base font-bold text-gray-900">Sensitive Seller Action</h3>
              </div>

              <div className="space-y-4 text-left">
                <p className="text-sm text-gray-600 leading-relaxed">
                  You are about to modify the status of seller <strong className="text-gray-900">{confirmModal.targetSeller.name}</strong> (Store: {confirmModal.targetSeller.storeName || "Unspecified"}).
                  {confirmModal.type === "delete" && " This action will deactivate the store and perform a soft-delete from the system."}
                  {confirmModal.type === "toggle_active" && ` Are you sure you want to ${confirmModal.targetActiveState ? "activate" : "deactivate"} this seller?`}
                </p>

                {confirmModal.type === "delete" && (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 space-y-3">
                    <p className="text-xs text-red-700 font-bold">
                      To confirm deletion, please type the seller's email address below to confirm: 
                      <span className="block bg-red-100 text-red-800 p-1.5 rounded mt-1 text-center font-mono select-all text-xs font-semibold">{confirmModal.targetSeller.email}</span>
                    </p>
                    <input
                      value={typedConfirmation}
                      onChange={(e) => setTypedConfirmation(e.target.value)}
                      placeholder="Type seller's email here..."
                      className="w-full px-4 py-2 border border-red-200 rounded-xl text-center text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-200 bg-white"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={executeConfirmedAction}
                    disabled={confirmModal.type === "delete" && typedConfirmation.trim().toLowerCase() !== confirmModal.targetSeller.email.trim().toLowerCase()}
                    className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center ${
                      confirmModal.type === "delete"
                        ? "bg-red-600 text-white hover:bg-red-700 disabled:opacity-40"
                        : "bg-[#103B40] text-white hover:bg-[#1b5c63]"
                    }`}
                  >
                    Confirm Action
                  </button>
                  <button
                    onClick={() => setConfirmModal({ show: false, type: "delete", targetSeller: null })}
                    className="flex-1 py-3 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-2xl text-xs font-bold transition-all text-center"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
