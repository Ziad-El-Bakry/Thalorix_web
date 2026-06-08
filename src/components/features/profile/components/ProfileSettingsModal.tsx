import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings, AlertCircle, Eye, EyeOff, LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usersService } from "@/lib/api/services/users.service";
import { authService } from "@/lib/api/services/auth.service";

type SettingsTab = "personal" | "password";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settingsTab: SettingsTab;
  setSettingsTab: (tab: SettingsTab) => void;
  user: any;
  setUser: (user: any) => void;
  expertiseData: any[];
  setExpertiseData: (data: any[]) => void;
  socialLinksData: any;
  setSocialLinksData: (data: any) => void;
  fireToast: (msg: string) => void;
  handleLogoutClick: () => void;
  handleDeleteAccountClick: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

export default function ProfileSettingsModal({
  isOpen,
  onClose,
  settingsTab,
  setSettingsTab,
  user,
  setUser,
  expertiseData,
  setExpertiseData,
  socialLinksData,
  setSocialLinksData,
  fireToast,
  handleLogoutClick,
  handleDeleteAccountClick,
}: ProfileSettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[6vh] px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e: any) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Settings size={20} className="text-[#103B40]" />
                <h2 className="text-lg font-bold text-[#103B40]">Edit Profile</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Settings tabs */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setSettingsTab("personal")}
                className={`flex-1 py-3 text-sm font-semibold transition-all ${
                  settingsTab === "personal" ? "text-[#103B40] border-b-2 border-[#103B40]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Personal Details
              </button>
              <button
                onClick={() => setSettingsTab("password")}
                className={`flex-1 py-3 text-sm font-semibold transition-all ${
                  settingsTab === "password" ? "text-[#103B40] border-b-2 border-[#103B40]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Change Password
              </button>
            </div>

            {/* Settings content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={settingsTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {settingsTab === "personal" ? (
                    <PersonalDetails
                      user={user}
                      onSave={(updatedData: any) => {
                        const newUser = { ...user, ...updatedData };
                        setUser(newUser);
                        localStorage.setItem("user", JSON.stringify(newUser));
                        fireToast("Profile updated successfully!");
                      }}
                      expertise={expertiseData}
                      setExpertise={setExpertiseData}
                      socialLinks={socialLinksData}
                      setSocialLinks={setSocialLinksData}
                    />
                  ) : (
                    <ChangePassword
                      user={user}
                      onSave={() => fireToast("Password updated successfully!")}
                      onCancel={() => setSettingsTab("personal")}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Danger zone */}
            <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
              <button onClick={handleLogoutClick} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PersonalDetails({ user, onSave, expertise, setExpertise, socialLinks, setSocialLinks }: { user: any; onSave: (data: any) => void; expertise: any[]; setExpertise: (e: any[]) => void; socialLinks: any; setSocialLinks: (s: any) => void }) {
  const [username, setUsername] = useState(user?.name || user?.username || "");
  const [email] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [emailError, setEmailError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setEmailError("");
    const userId = user?.id || user?._id;
    if (!userId) return;
    setIsSaving(true);
    try {
      const updateDto = { username, bio, expertise, socialLinks };
      await usersService.updateProfile(userId, updateDto);
      onSave({ ...updateDto, name: username });
    } catch (error: any) {
      console.error("Failed to update profile", error);
      setEmailError(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
      <motion.div variants={itemVariants} className="mb-5">
        <label className="block text-xs font-semibold text-gray-700 mb-2">Username</label>
        <Input value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} className="bg-gray-50 border border-gray-200 shadow-sm h-11" />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-5">
        <label className="block text-xs font-semibold text-gray-700 mb-2">Email Address</label>
        <Input value={email} disabled className="bg-gray-100 shadow-sm h-11 border border-gray-200 text-gray-500 cursor-not-allowed" />
        <AnimatePresence>
          {emailError && (
            <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-xs text-red-500 mt-2 flex items-center gap-1.5 font-medium overflow-hidden">
              <AlertCircle size={14} className="fill-red-500 text-white" />
              {emailError}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <label className="block text-xs font-semibold text-gray-700 mb-2">Bio</label>
        <textarea
          value={bio}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
          className="w-full border border-gray-200 shadow-sm rounded-lg p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-teal-200 bg-gray-50 transition-all text-sm"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6 border-t border-gray-100 pt-6">
        <h3 className="text-sm font-bold mb-4 text-[#103B40]">Social Media Accounts</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Facebook</label>
            <Input value={socialLinks.facebook || ""} onChange={(e: any) => setSocialLinks({ ...socialLinks, facebook: e.target.value })} className="bg-gray-50 border border-gray-200 shadow-sm h-11" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Instagram</label>
            <Input value={socialLinks.instagram || ""} onChange={(e: any) => setSocialLinks({ ...socialLinks, instagram: e.target.value })} className="bg-gray-50 border border-gray-200 shadow-sm h-11" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">GitHub</label>
            <Input value={socialLinks.github || ""} onChange={(e: any) => setSocialLinks({ ...socialLinks, github: e.target.value })} className="bg-gray-50 border border-gray-200 shadow-sm h-11" />
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} variant="primary" className="bg-[#103B40] hover:bg-[#0c2e32] h-10 shadow-md font-medium px-8 transition-transform hover:scale-105 active:scale-95 disabled:opacity-70">
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </motion.div>
    </motion.div>
  );
}

function ChangePassword({ user, onSave, onCancel }: { user: any; onSave: () => void; onCancel: () => void }) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const handleSave = async () => {
    setError("");
    const targetId = user?.id || user?._id;
    const role = user?.role || "user";
    if (!targetId) return setError("User ID not found.");
    if (!oldPassword || !newPassword || !confirmNewPassword) return setError("All fields are required.");
    if (!passwordRegex.test(newPassword)) { setError("New password must be at least 8 characters long and include uppercase, lowercase, number, and special character."); return; }
    if (newPassword !== confirmNewPassword) return setError("New passwords do not match.");
    setIsSaving(true);
    try {
      await authService.changePassword(targetId, role, { oldPassword, newPassword, confirmPassword: confirmNewPassword });
      onSave();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
      <motion.div variants={itemVariants} className="mb-5">
        <label className="block text-xs font-semibold text-gray-700 mb-2">Email</label>
        <Input value={user?.email || ""} disabled className="bg-gray-100 border border-gray-200 shadow-sm h-11 text-gray-500" />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-5 relative">
        <label className="block text-xs font-semibold text-gray-700 mb-2">Current Password</label>
        <div className="relative">
          <Input type={showOldPassword ? "text" : "password"} value={oldPassword} onChange={(e: any) => setOldPassword(e.target.value)} className="bg-gray-50 border border-gray-200 shadow-sm h-11 pr-10" />
          <motion.button whileTap={{ scale: 0.8 }} type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </motion.button>
        </div>
        <div className="mt-2 text-right">
          <Link href="/forget-password" className="text-xs font-semibold text-[#103B40] hover:underline transition-all">Forgot your password?</Link>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-5 relative">
        <label className="block text-xs font-semibold text-gray-700 mb-2">New Password</label>
        <div className="relative">
          <Input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e: any) => setNewPassword(e.target.value)} className="bg-gray-50 border border-gray-200 shadow-sm h-11 pr-10" />
          <motion.button whileTap={{ scale: 0.8 }} type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </motion.button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-4 relative">
        <label className="block text-xs font-semibold text-gray-700 mb-2">Confirm New Password</label>
        <div className="relative">
          <Input type={showConfirmPassword ? "text" : "password"} value={confirmNewPassword} onChange={(e: any) => setConfirmNewPassword(e.target.value)} className="bg-gray-50 border border-gray-200 shadow-sm h-11 pr-10" />
          <motion.button whileTap={{ scale: 0.8 }} type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="text-xs text-red-500 mb-4 flex items-start gap-1.5 font-medium leading-tight overflow-hidden">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onCancel} className="flex-1 bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 h-10 shadow-sm font-medium">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving} variant="primary" className="flex-1 bg-[#103B40] hover:bg-[#0c2e32] h-10 shadow-md font-medium disabled:opacity-70">
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </motion.div>
    </motion.div>
  );
}
