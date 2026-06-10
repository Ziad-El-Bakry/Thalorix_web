"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User as UserIcon, Lock, LogOut, Trash2, CheckCircle, Palette, Sun, Moon, Monitor, Eye, EyeOff } from "lucide-react";
import { authService, User } from "@/lib/api/services/auth.service";
import { usersService } from "@/lib/api/services/users.service";
import { useRouter } from "next/navigation";
import { LogoutModal, DeleteAccountModal } from "@/components/shared/ProfileModals";

type ThemeMode = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(mode: ThemeMode) {
  const resolved = mode === "system" ? getSystemTheme() : mode;
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export default function SettingsPageContent() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"account" | "password" | "appearance">("account");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Appearance state
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Load persisted appearance settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem("thalorix-appearance");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.themeMode) setThemeMode(parsed.themeMode);
        applyTheme(parsed.themeMode || "light");
      }
    } catch {
      // ignore
    }
  }, []);

  // Listen for system theme changes when mode is "system"
  useEffect(() => {
    if (themeMode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [themeMode]);

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
    if (user?.id) {
      try {
        await usersService.deleteUser(user.id);
        await authService.logout();
        router.push("/login");
      } catch (error) {
        fireToast("Failed to delete account");
      }
    }
  };

  const persistAppearance = useCallback(
    (overrides: Partial<{ themeMode: ThemeMode }>) => {
      const next = {
        themeMode: overrides.themeMode ?? themeMode,
      };
      localStorage.setItem("thalorix-appearance", JSON.stringify(next));
    },
    [themeMode]
  );

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    applyTheme(mode);
    persistAppearance({ themeMode: mode });
  };

  if (!user) return null;

  const tabs = [
    { id: "account", label: "Account Settings", icon: <UserIcon size={18} /> },
    { id: "password", label: "Password & Security", icon: <Lock size={18} /> },
    { id: "appearance", label: "Appearance", icon: <Palette size={18} /> },
  ] as const;

  const themeModes: { id: ThemeMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "light", label: "Light", icon: <Sun size={22} />, desc: "Clean & bright interface" },
    { id: "dark", label: "Dark", icon: <Moon size={22} />, desc: "Easy on the eyes" },
    { id: "system", label: "System", icon: <Monitor size={22} />, desc: "Match your device" },
  ];

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
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col p-2 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#103B40] text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <div className={activeTab === tab.id ? "text-white" : "text-gray-400 dark:text-gray-500"}>
                {tab.icon}
              </div>
              {tab.label}
            </button>
          ))}

          <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 mx-2" />

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            <LogOut size={18} className="text-gray-400 dark:text-gray-500" />
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
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 sm:p-8 min-h-[500px]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
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
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43B0B5]/30 focus:border-[#43B0B5] transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43B0B5]/30 focus:border-[#43B0B5] transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Bio</label>
                    <textarea
                      rows={4}
                      defaultValue={user.bio}
                      placeholder="Tell us about yourself"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43B0B5]/30 focus:border-[#43B0B5] transition-all resize-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
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
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full pl-4 pr-12 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43B0B5]/30 focus:border-[#43B0B5] transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full pl-4 pr-12 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43B0B5]/30 focus:border-[#43B0B5] transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full pl-4 pr-12 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43B0B5]/30 focus:border-[#43B0B5] transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "appearance" && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* ─── Theme Mode Selector ─── */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Theme Mode</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Choose how Thalorix looks to you</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {themeModes.map((mode) => {
                        const isActive = themeMode === mode.id;
                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => handleThemeChange(mode.id)}
                            className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer group ${
                              isActive
                                ? "border-[#43B0B5] bg-[#43B0B5]/5 dark:bg-[#43B0B5]/10 shadow-lg shadow-[#43B0B5]/10"
                                : "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                            }`}
                          >
                            {/* Active indicator */}
                            {isActive && (
                              <motion.div
                                layoutId="theme-active"
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#43B0B5] rounded-full flex items-center justify-center shadow-md"
                              >
                                <CheckCircle size={12} className="text-white" />
                              </motion.div>
                            )}

                            {/* Preview card */}
                            <div
                              className={`w-full h-20 rounded-xl border overflow-hidden ${
                                mode.id === "dark"
                                  ? "bg-gray-900 border-gray-700"
                                  : mode.id === "light"
                                  ? "bg-white border-gray-200"
                                  : "bg-gradient-to-br from-white via-gray-100 to-gray-900 border-gray-300"
                              }`}
                            >
                              {/* Mini UI preview */}
                              <div className="p-2 h-full flex flex-col gap-1.5">
                                <div
                                  className={`h-2 w-10 rounded-full ${
                                    mode.id === "dark" ? "bg-gray-700" : "bg-gray-200"
                                  }`}
                                />
                                <div
                                  className={`h-1.5 w-16 rounded-full ${
                                    mode.id === "dark" ? "bg-gray-800" : "bg-gray-100"
                                  }`}
                                />
                                <div className="flex gap-1 mt-auto">
                                  <div className="h-2 w-6 rounded bg-[#43B0B5]/60" />
                                  <div
                                    className={`h-2 w-8 rounded ${
                                      mode.id === "dark" ? "bg-gray-700" : "bg-gray-200"
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div
                                className={`${
                                  isActive ? "text-[#43B0B5]" : "text-gray-400 group-hover:text-gray-600"
                                } transition-colors`}
                              >
                                {mode.icon}
                              </div>
                              <div className="text-left">
                                <p
                                  className={`text-sm font-bold ${
                                    isActive ? "text-[#103B40] dark:text-[#43B0B5]" : "text-gray-700 dark:text-gray-200"
                                  }`}
                                >
                                  {mode.label}
                                </p>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500">{mode.desc}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
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
