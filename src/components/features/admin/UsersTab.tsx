"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, Ban, Check, Trash2, X, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { usersService } from "@/lib/api/services/users.service";
import { authService, type User } from "@/lib/api/services/auth.service";

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  
  // Current logged in admin info to prevent self-deletion & demotion
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  // Modals state
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: "delete" | "role" | "block";
    targetUser: User | null;
    targetRole?: string;
    targetBlockState?: boolean;
  }>({ show: false, type: "delete", targetUser: null });

  const [typedConfirmation, setTypedConfirmation] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to page 1 on new search
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Load current admin from storage
  useEffect(() => {
    const user = authService.getStoredUser();
    setCurrentAdmin(user);
  }, []);

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersService.getAllUsers({
        page,
        limit,
        search: debouncedSearch,
      });
      const fetchedUsers = data.users || [];
      const sortedUsers = fetchedUsers.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return dateB - dateA;
      });
      setUsers(sortedUsers);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Error fetching users:", err);
      showToast("Failed to load user list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleActionClick = (
    type: "delete" | "role" | "block",
    user: User,
    role?: string,
    blockState?: boolean
  ) => {
    // Check if modifying own self
    const currentAdminId = currentAdmin?.id || currentAdmin?._id;
    const targetUserId = user.id;

    if (currentAdminId === targetUserId) {
      showToast("Sorry, you cannot update, block, or delete your own account!");
      return;
    }

    setTypedConfirmation("");
    setConfirmModal({
      show: true,
      type,
      targetUser: user,
      targetRole: role,
      targetBlockState: blockState,
    });
  };

  const executeConfirmedAction = async () => {
    const { type, targetUser, targetRole, targetBlockState } = confirmModal;
    if (!targetUser) return;
    const userId = targetUser.id;

    try {
      if (type === "delete") {
        if (typedConfirmation.toUpperCase() !== "DELETE") {
          showToast("Please type the confirmation code correctly");
          return;
        }
        await usersService.deleteUser(userId);
        showToast(`User ${targetUser.name} deleted successfully (soft delete)`);
      } else if (type === "role" && targetRole) {
        await usersService.updateUser(userId, { role: targetRole as "user" | "admin" | "seller" });
        showToast(`Successfully changed role of ${targetUser.name} to ${targetRole}`);
      } else if (type === "block") {
        if (targetBlockState) {
          await usersService.adminBlockUser(userId);
        } else {
          await usersService.adminUnblockUser(userId);
        }
        showToast(
          targetBlockState
            ? `User ${targetUser.name} has been blocked successfully`
            : `User ${targetUser.name} has been unblocked successfully`
        );
      }
      setConfirmModal({ show: false, type: "delete", targetUser: null });
      fetchUsers();
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
          <h2 className="text-lg font-bold text-gray-800">User Management</h2>
          <p className="text-xs text-gray-400 mt-1">Manage user accounts, roles, block states, and soft-delete restrictions</p>
        </div>
        <div className="relative w-full md:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#103B40]/20 focus:border-[#103B40] transition-all bg-white"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 border-4 border-[#103B40] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 font-medium">Loading users from server...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-24">
            <Ban size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">No users found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 font-bold">
                <th className="text-left px-6 py-4">Name & Profile Info</th>
                <th className="text-left px-6 py-4">Phone Number</th>
                <th className="text-center px-6 py-4">Account Role</th>
                <th className="text-center px-6 py-4">Block Status</th>
                <th className="text-center px-6 py-4">Verification</th>
                <th className="text-center px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const userId = user.id;
                const isSelf = currentAdmin && (currentAdmin.id === userId || currentAdmin._id === userId);
                
                return (
                  <motion.tr
                    key={userId}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-200"
                  >
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-extrabold shadow-sm"
                          style={{
                            background: isSelf
                              ? "linear-gradient(135deg, #103B40, #1b5c63)"
                              : "linear-gradient(135deg, #475569, #64748b)",
                          }}
                        >
                          {(user.name || "US").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800">{user.name}</span>
                            {isSelf && (
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-[#103B40]/10 text-[#103B40]">
                                You (Admin)
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400 block mt-0.5">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-gray-600 font-medium">{user.phone || "—"}</td>

                    {/* Role badge (fixed at signup) */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold w-28 mx-auto ${
                        user.role === "admin"
                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                          : user.role === "seller"
                          ? "bg-teal-50 text-teal-600 border border-teal-200"
                          : "bg-slate-50 text-slate-600 border border-slate-200"
                      }`}>
                        {user.role === "admin" && <Shield size={13} />}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>

                    {/* Block state toggle */}
                    <td className="px-6 py-4 text-center">
                      {isSelf ? (
                        <span className="text-xs text-gray-400 font-medium">Unblockable</span>
                      ) : (
                        <button
                          onClick={() => handleActionClick("block", user, undefined, !user.isBlocked)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            user.isBlocked
                              ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                              : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          }`}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </button>
                      )}
                    </td>

                    {/* Verification Status */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          user.isVerified
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-gray-50 text-gray-400 border border-gray-100"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      {isSelf ? (
                        <span className="text-xs text-gray-400 font-medium">Protected</span>
                      ) : (
                        <button
                          onClick={() => handleActionClick("delete", user)}
                          className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
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
            Page {page} of {totalPages} (Total {total} users)
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

      {/* Toasts */}
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

      {/* Modern Hardened Action Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.show && confirmModal.targetUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 max-w-md w-full relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setConfirmModal({ show: false, type: "delete", targetUser: null })}
                  className="p-1 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center gap-3 text-amber-500 mb-4">
                <AlertTriangle size={28} className="text-amber-600 animate-pulse" />
                <h3 className="text-base font-bold text-gray-900">Highly Sensitive Action</h3>
              </div>

              <div className="space-y-4 text-left">
                <p className="text-sm text-gray-600 leading-relaxed">
                  You are about to modify the status of user <strong className="text-gray-900">{confirmModal.targetUser.name}</strong>. 
                  {confirmModal.type === "delete" && " This action will perform a soft-delete, temporarily removing their platform login privileges."}
                  {confirmModal.type === "role" && ` Are you sure you want to change their role to ${confirmModal.targetRole}?`}
                  {confirmModal.type === "block" && ` Are you sure you want to ${confirmModal.targetBlockState ? "block" : "unblock"} this user?`}
                </p>

                {confirmModal.type === "delete" && (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 space-y-3">
                    <p className="text-xs text-red-600 font-bold">
                      To confirm this action, please type the word <span className="bg-red-200 px-2 py-0.5 rounded text-red-800 tracking-widest font-mono font-extrabold">DELETE</span> below:
                    </p>
                    <input
                      value={typedConfirmation}
                      onChange={(e) => setTypedConfirmation(e.target.value)}
                      placeholder="Type DELETE here..."
                      className="w-full px-4 py-2 border border-red-200 rounded-xl text-center font-mono tracking-widest text-sm focus:outline-none focus:ring-2 focus:ring-red-200 bg-white"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={executeConfirmedAction}
                    disabled={confirmModal.type === "delete" && typedConfirmation.toUpperCase() !== "DELETE"}
                    className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center ${
                      confirmModal.type === "delete"
                        ? "bg-red-600 text-white hover:bg-red-700 disabled:opacity-40"
                        : "bg-[#103B40] text-white hover:bg-[#1b5c63]"
                    }`}
                  >
                    Confirm Action
                  </button>
                  <button
                    onClick={() => setConfirmModal({ show: false, type: "delete", targetUser: null })}
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
