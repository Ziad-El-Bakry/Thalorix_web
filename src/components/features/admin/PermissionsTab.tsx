"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  ShoppingCart,
  Blocks,
  MessageCircle,
  Mail,
  Shield,
  Check,
} from "lucide-react";
import { mockUsers, AdminUser } from "./adminMockData";
import PermissionToggle from "./PermissionToggle";

const permKeys = [
  { key: "post" as const, label: "Post", icon: FileText, color: "#16a34a" },
  { key: "buy" as const, label: "Buy", icon: ShoppingCart, color: "#0891b2" },
  { key: "templates" as const, label: "Templates", icon: Blocks, color: "#8b5cf6" },
  { key: "comment" as const, label: "Comment", icon: MessageCircle, color: "#f59e0b" },
  { key: "message" as const, label: "Message", icon: Mail, color: "#3b82f6" },
  { key: "admin" as const, label: "Admin", icon: Shield, color: "#dc2626" },
];

export default function PermissionsTab() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [toast, setToast] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const togglePermission = (userId: string, key: keyof AdminUser["permissions"]) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, permissions: { ...u.permissions, [key]: !u.permissions[key] } }
          : u
      )
    );
  };

  const grantAll = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              permissions: { post: true, buy: true, templates: true, comment: true, message: true, admin: true },
            }
          : u
      )
    );
    showToast("All permissions granted");
  };

  const getPermCount = (user: AdminUser) => {
    const perms = Object.values(user.permissions);
    return `${perms.filter(Boolean).length}/${perms.length}`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Permission Legend */}
      <div className="px-5 pt-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-1 flex-wrap text-xs">
          <span className="text-gray-500 font-semibold mr-2 uppercase tracking-wider">Permission Keys:</span>
          {permKeys.map((pk) => {
            const Icon = pk.icon;
            return (
              <span key={pk.key} className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ color: pk.color }}>
                <Icon size={12} />
                <span className="font-semibold">{pk.label}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#103B40]/20 focus:border-[#103B40] transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
              {permKeys.map((pk) => {
                const Icon = pk.icon;
                return (
                  <th key={pk.key} className="text-center px-3 py-3">
                    <div className="flex flex-col items-center gap-1">
                      <Icon size={14} style={{ color: pk.color }} />
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{pk.label}</span>
                    </div>
                  </th>
                );
              })}
              <th className="text-center px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                {/* User */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        {user.isAdmin && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-500 uppercase">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400">{user.role}</p>
                    </div>
                  </div>
                </td>
                {/* Permission Toggles */}
                {permKeys.map((pk) => (
                  <td key={pk.key} className="px-3 py-4 text-center">
                    <div className="flex justify-center">
                      <PermissionToggle
                        enabled={user.permissions[pk.key]}
                        onToggle={() => togglePermission(user.id, pk.key)}
                      />
                    </div>
                  </td>
                ))}
                {/* Quick Action */}
                <td className="px-5 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">{getPermCount(user)}</span>
                    <button
                      onClick={() => grantAll(user.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#103B40] bg-[#103B40]/5 hover:bg-[#103B40]/10 transition-colors whitespace-nowrap"
                    >
                      Grant All
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No users found.</p>
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
    </motion.div>
  );
}
