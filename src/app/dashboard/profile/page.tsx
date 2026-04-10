"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Code, Camera, Copy, Lock, Trash2, CheckCircle, AlertCircle, Eye, EyeOff, ArrowLeft, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Notifications from "@/components/shared/Notification";
import { authService } from "@/lib/api/services/auth.service";
import { usersService } from "@/lib/api/services/users.service";
import { useAvatar } from "@/store/useAvatarStore";

type Tab = "personal" | "password";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>("personal");
    const [showToast, setShowToast] = useState(false);
    const [copied, setCopied] = useState(false);
    const { avatar: previewImage, setAvatar: setPreviewImage } = useAvatar();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = authService.getStoredUser();
                if (storedUser?.id) {
                    const data = await usersService.getUserById(storedUser.id);
                    setUser(data);
                    if (data.avatar) setPreviewImage(data.avatar);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const userId = user?.id || "N/A";

    const handleCopy = () => {
        navigator.clipboard.writeText(userId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload to backend
            try {
                const { avatarUrl } = await usersService.uploadAvatar(file);
                if (avatarUrl) setPreviewImage(avatarUrl);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } catch (error) {
                console.error('Failed to upload avatar:', error);
            }
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleLogout = async () => {
        await authService.logout();
        router.push("/login");
    };

    const handleDeleteAccount = async () => {
        if (!user?.id) return;
        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (confirmDelete) {
            try {
                await usersService.deleteUser(user.id);
                await authService.logout();
                router.push("/login");
            } catch (error) {
                console.error("Failed to delete account", error);
                alert("Failed to delete account");
            }
        }
    };


    return (
        <div className="w-full flex flex-col gap-6 relative">
            {/* Image Preview Modal */}
            <AnimatePresence>
                {isPreviewModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setIsPreviewModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl w-full flex items-center justify-center p-6"
                            onClick={(e: any) => e.stopPropagation()}
                        >
                            <img src={previewImage} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
                            <button
                                onClick={() => setIsPreviewModalOpen(false)}
                                className="absolute top-0 right-0 md:-top-6 md:-right-6 bg-white/10 hover:bg-white/25 p-2 rounded-full text-white backdrop-blur-md transition-colors border border-white/20 z-10"
                            >
                                <X size={24} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast Notification - Floating at top of page */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ y: -100, opacity: 0, x: "-50%" }}
                        animate={{ y: 20, opacity: 1, x: "-50%" }}
                        exit={{ y: -100, opacity: 0, x: "-50%" }}
                        className="fixed top-0 left-1/2 z-[100] w-full max-w-sm"
                    >
                        <div className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow-2xl text-white text-sm font-bold bg-[#1fce81] border border-white/20">
                            <CheckCircle size={18} />
                            {activeTab === "password"
                                ? "Password updated successfully!"
                                : fileInputRef.current?.files?.length
                                    ? "Profile photo updated!"
                                    : "Profile updated successfully!"}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top Header - Moved outside the border */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-end items-center px-4"
            >
                <div className="flex gap-4">
                    <Notifications />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="primary" className="rounded-full px-5 py-2 h-10 gap-2 text-sm shadow-md">
                            <Code size={16} />
                            Developer
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Main Profile Card Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full min-h-[800px] bg-[#Eef2f5] rounded-xl border-[6px] border-[#97BEC1] flex flex-col relative overflow-hidden shadow-2xl"
            >
                <div className="flex flex-col md:flex-row flex-1 p-8 gap-10">
                    {/* Left Sidebar / Profile Info */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                        className="w-full md:w-[320px] flex flex-col items-center border-r border-[#D3E0E2] pr-8 pl-4"
                    >
                        <h2 className="text-[26px] font-semibold mb-8 text-[#103B40] w-full text-center">User Profile</h2>

                        <div className="relative mb-3 group flex justify-center w-full">
                            <div className="relative">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <motion.div 
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    whileHover={{ scale: 1.05 }}
                                    className="w-[100px] h-[100px] rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center relative cursor-pointer z-10"
                                >
                                    <Image src={previewImage} alt="Avatar" layout="fill" className="object-cover" />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <Camera size={24} className="text-white" />
                                    </div>
                                </motion.div>
                                <motion.button 
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute bottom-0 right-0 bg-[#103B40] text-white p-2 rounded-full shadow-md hover:bg-[#0c2e32] transition-colors z-20"
                                >
                                    <Camera size={14} />
                                </motion.button>

                                {/* Dropdown overlay to close menu */}
                                {isMenuOpen && (
                                    <div 
                                        className="fixed inset-0 z-30" 
                                        onClick={() => setIsMenuOpen(false)} 
                                    />
                                )}
                                
                                <AnimatePresence>
                                    {isMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute md:top-[110px] top-[100px] left-1/2 -translate-x-1/2 z-40 bg-white rounded-xl shadow-xl border border-gray-100 w-48 overflow-hidden"
                                        >
                                            <button 
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    triggerUpload();
                                                }}
                                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium border-b border-gray-50 last:border-0"
                                            >
                                                <Camera size={16} className="text-[#103B40]" />
                                                Change Image
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    setIsPreviewModalOpen(true);
                                                }}
                                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium border-b border-gray-50 last:border-0"
                                            >
                                                <Eye size={16} className="text-[#103B40]" />
                                                Preview Image
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <p className="text-xs text-center text-gray-400 mb-8 font-medium">
                            Tap camera icon to change avatar<br />Max size: 5MB
                        </p>

                        <div className="flex items-center gap-2 mb-10 w-full justify-center">
                            <div className="bg-white border border-gray-200 rounded px-3 py-2 text-xs text-gray-500 truncate w-[160px] shadow-sm">
                            User ID: {userId}
                        </div>
                        <motion.button 
                            whileHover={{ backgroundColor: copied ? "#16a34a" : "#f9fafb" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCopy}
                            animate={{
                                backgroundColor: copied ? "#22c55e" : "#ffffff",
                                borderColor: copied ? "#22c55e" : "#e5e7eb",
                                color: copied ? "#ffffff" : "#4b5563"
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold border rounded shadow-sm transition-colors duration-200"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={copied ? "check" : "copy"}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.15 }}
                                    className="flex items-center gap-1.5"
                                >
                                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                                    <span>{copied ? "Copied!" : "Copy"}</span>
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>
                        </div>

                        <div className="w-full text-left">
                            <h3 className="text-sm font-bold mb-4 text-[#103B40]">Security Settings</h3>

                            <motion.button
                                whileHover={{ x: 5 }}
                                onClick={() => setActiveTab("password")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md mb-2 transition-all ${activeTab === "password" ? "bg-[#103B40] text-white shadow-md scale-105" : "text-gray-600 hover:bg-[#D8E4E5]"
                                    }`}
                            >
                                <Lock size={16} className={activeTab === "password" ? "text-white" : "text-gray-500"} />
                                <span className="text-sm font-semibold">Change Password</span>
                            </motion.button>

                            <motion.button
                                onClick={handleDeleteAccount}
                                whileHover={{ x: 5, backgroundColor: "#fef2f2" }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-red-500 transition-colors mt-2"
                            >
                                <Trash2 size={16} />
                                <span className="text-sm font-semibold">Delete User</span>
                            </motion.button>
                            <motion.button
                                onClick={handleLogout}
                                whileHover={{ x: 5, backgroundColor: "#fef2f2" }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-black-500 transition-colors mt-2"
                            >
                                <LogOut size={16} />
                                <span className="text-sm font-semibold">Logout</span>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Right Content Area */}
                    <div className="flex-1 relative pl-2 overflow-hidden">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mt-16 w-full pr-10"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#103B40]"></div>
                                </div>
                            ) : activeTab === "personal" ? (
                                <PersonalDetails user={user} onSave={handleSave} />
                            ) : (
                                <ChangePassword user={user} onSave={handleSave} onCancel={() => setActiveTab("personal")} />
                            )}
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
};

function PersonalDetails({ user, onSave }: { user: any, onSave: () => void }) {
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [emailError, setEmailError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setEmailError("");
        if (!user?.id) return;
        setIsSaving(true);
        try {
            await usersService.updateProfile(user.id, { username, bio });
            onSave();
        } catch (error: any) {
            console.error("Failed to update profile", error);
            setEmailError(error?.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-2xl mx-auto md:mx-0"
        >
            <motion.h2 variants={itemVariants} className="text-[22px] font-semibold mb-6 text-[#103B40]">Personal Details</motion.h2>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Username</label>
                    <Input value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} className="bg-white border-none shadow-sm h-11" />
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Email Address</label>
                <Input
                    value={email}
                    disabled
                    className="bg-gray-100 shadow-sm h-11 border-none text-gray-500 cursor-not-allowed"
                />
                <AnimatePresence>
                    {emailError && (
                        <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-xs text-red-500 mt-2 flex items-center gap-1.5 font-medium overflow-hidden"
                        >
                            <AlertCircle size={14} className="fill-red-500 text-white" />
                            {emailError}
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8 border-b border-[#D3E0E2] pb-10 mt-6">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Bio</label>
                <textarea
                    value={bio}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
                    className="w-full border-none shadow-sm rounded-md p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white transition-all"
                ></textarea>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h3 className="text-lg font-bold mb-5 text-[#103B40]">Social Media Account</h3>

                <div className="mb-5">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Facebook</label>
                    <Input defaultValue="" className="bg-white border-none shadow-sm h-11" />
                </div>

                <div className="mb-5">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Instagram</label>
                    <Input defaultValue="" className="bg-white border-none shadow-sm h-11" />
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 flex justify-end">
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
        if (!oldPassword) {
            setError("Please enter your current password.");
            return;
        }
        if (!newPassword) {
            setError("Please enter a new password.");
            return;
        }
        if (!passwordRegex.test(newPassword)) {
            setError("New password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match.");
            return;
        }
        setIsSaving(true);
        try {
            await usersService.changePassword({
                currentPassword: oldPassword,
                newPassword,
                confirmPassword: confirmNewPassword,
            });
            onSave();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to change password.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-lg mx-auto md:mx-0"
        >
            <motion.h2 variants={itemVariants} className="text-[22px] font-semibold mb-8 text-[#103B40]">Change Password</motion.h2>

            <motion.div variants={itemVariants} className="mb-6 mt-4">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Enter your Email</label>
                <Input value={user?.email || ''} disabled className="bg-white border-none shadow-sm h-11 text-gray-500" />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6 mt-2 relative">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Enter Current Password</label>
                <div className="relative">
                    <Input
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e: any) => setOldPassword(e.target.value)}
                        className="bg-white border-none shadow-sm h-11 text-gray-500 pr-10 transition-all"
                    />
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.button>
                </div>
                <div className="mt-2 text-right">
                    <Link 
                        href="/forget-password" 
                        className="text-xs font-semibold text-[#103B40] hover:underline transition-all"
                    >
                        Forgot your password?
                    </Link>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6 mt-2 relative">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Enter New Password</label>
                <div className="relative">
                    <Input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e: any) => setNewPassword(e.target.value)}
                        className="bg-white border-none shadow-sm h-11 text-gray-500 pr-10 transition-all"
                    />
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.button>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4 mt-2 relative">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(e: any) => setConfirmNewPassword(e.target.value)}
                        className="bg-white border-none shadow-sm h-11 text-gray-500 pr-10 transition-all"
                    />
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.button>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {error && (
                    <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="text-xs text-red-500 mb-4 flex items-start gap-1.5 font-medium leading-tight overflow-hidden"
                    >
                        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>

            <motion.div variants={itemVariants} className="flex gap-4 mt-8 w-64">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1 bg-[#f3f4f6] text-gray-600 border border-gray-200 hover:bg-gray-200 h-10 shadow-sm font-medium flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
                >
                    <ArrowLeft size={16} />
                    Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} variant="primary" className="flex-1 bg-[#103B40] hover:bg-[#0c2e32] h-10 shadow-md font-medium transition-transform hover:scale-105 active:scale-95 disabled:opacity-70">
                    {isSaving ? 'Saving...' : 'Save'}
                </Button>
            </motion.div>
        </motion.div>
    );
}