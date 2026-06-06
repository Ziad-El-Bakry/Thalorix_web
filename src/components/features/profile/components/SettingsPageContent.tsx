"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User as UserIcon, Lock, Bell, Eye, Store, LogOut, Trash2, CheckCircle, Shield, Settings } from "lucide-react";
import { authService, User } from "@/lib/api/services/auth.service";
import { usersService } from "@/lib/api/services/users.service";
import { useRouter } from "next/navigation";
import { LogoutModal, DeleteAccountModal } from "@/components/shared/ProfileModals";

export default function SettingsPageContent() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"account" | "password" | "notifications" | "privacy" | "store" | "admin">("account");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      // Set the appropriate default tab based on role if needed, or keep 'account'
    } else {
        router.push("/login");
    }
  }, [router]);

  const fireToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "password") {
      if (!oldPassword || !newPassword || !confirmPassword) {
        fireToast("Please fill all password fields");
        return;
      }
      if (newPassword !== confirmPassword) {
        fireToast("New passwords do not match");
        return;
      }
      setIsLoading(true);
      try {
        if(user?.id && user?.role) {
          await authService.changePassword(user.id, user.role, { oldPassword, newPassword, confirmPassword });
          fireToast("Password changed successfully");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          fireToast("User session invalid");
        }
      } catch (error: any) {
        fireToast(error?.response?.data?.message || "Failed to change password");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    // Mock save for other tabs
    setTimeout(() => {
      setIsLoading(false);
      fireToast("Settings saved successfully");
    }, 1000);
  };

  const handleLogoutConfirm = async () => {
    await authService.logout();
    router.push("/login");
  };

  const handleDeleteConfirm = async () => {
    if(user?.id) {
        try {
            await usersService.deleteUser(user.id);
            await authService.logout();
            router.push("/login");
        } catch (error) {
            fireToast("Failed to delete account");
        }
    }
  };

  if (!user) return null;

  const tabs = [
    { id: "account", label: "Account Settings", icon: <UserIcon size={18} /> },
    { id: "password", label: "Password & Security", icon: <Lock size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "privacy", label: "Privacy & Visibility", icon: <Eye size={18} /> },
    ...(user.role === "seller" ? [{ id: "store", label: "Store Preferences", icon: <Store size={18} /> }] : []),
    ...(user.role === "admin" ? [{ id: "admin", label: "Platform Settings", icon: <Shield size={18} /> }] : []),
  ] as const;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -50, opacity: 0, x: "-50%" }}
            animate={{ y: 20, opacity: 1, x: "-50%" }}
            exit={{ y: -50, opacity: 0, x: "-50%" }}
            className="fixed top-4 left-1/2 z-[9999] bg-emerald-600 border border-emerald-500 shadow-2xl text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 pointer-events-none"
          >
            <CheckCircle size={16} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col p-2 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#103B40] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className={activeTab === tab.id ? "text-white" : "text-gray-400"}>
                {tab.icon}
              </div>
              {tab.label}
            </button>
          ))}

          <div className="h-px bg-gray-100 my-2 mx-2" />

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            <LogOut size={18} className="text-gray-400" />
            Log Out
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <Trash2 size={18} className="text-red-500" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 min-h-[500px]">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>

          <form onSubmit={handleSave} className="space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === "account" && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user.name}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43B0B5]/30 focus:border-[#43B0B5] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Username</label>
                      <input
                        type="text"
                        defaultValue={user.username}
                        placeholder="Enter your username"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43B0B5]/30 focus:border-[#43B0B5] transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43B0B5]/30 focus:border-[#43B0B5] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Bio</label>
                    <textarea
                      rows={4}
                      defaultValue={user.bio}
                      placeholder="Tell us about yourself"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43B0B5]/30 focus:border-[#43B0B5] transition-all resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === "password" && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Current Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43B0B5]/30 focus:border-[#43B0B5] transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43B0B5]/30 focus:border-[#43B0B5] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43B0B5]/30 focus:border-[#43B0B5] transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {(activeTab === "notifications" || activeTab === "privacy" || activeTab === "store" || activeTab === "admin") && (
                <motion.div
                  key="other"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Settings size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Preferences Configuration</h3>
                  <p className="text-gray-500 max-w-sm">
                    Configure your {activeTab} settings here. These options control your overall experience on the platform.
                  </p>
                  
                  {/* Mock Toggles */}
                  <div className="w-full max-w-md mt-8 space-y-4 text-left">
                     {[1, 2, 3].map(i => (
                         <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                             <div>
                                 <p className="font-bold text-gray-800 text-sm">Setting Option {i}</p>
                                 <p className="text-xs text-gray-500 mt-0.5">Toggle this setting on or off</p>
                             </div>
                             <div className="w-10 h-6 bg-[#43B0B5] rounded-full relative cursor-pointer shadow-inner">
                                 <div className="absolute right-1 top-1 bottom-1 w-4 bg-white rounded-full shadow-sm" />
                             </div>
                         </div>
                     ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-[#103B40] text-white rounded-xl font-bold hover:bg-[#0d2c2e] transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <LogoutModal isOpen={isLogoutModalOpen} isLoggingOut={false} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleLogoutConfirm} />
      <DeleteAccountModal isOpen={isDeleteModalOpen} isDeleting={false} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteConfirm} />
    </div>
  );
}
