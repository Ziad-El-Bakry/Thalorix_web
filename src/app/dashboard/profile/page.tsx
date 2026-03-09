"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Bell, Code, Camera, Copy, Lock, Trash2, CheckCircle, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Tab = "personal" | "password";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<Tab>("personal");
    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Top Header - Moved outside the border */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-end items-center px-4"
            >
                <div className="flex gap-4">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <Bell size={24} />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </motion.button>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="primary" className="rounded-full px-5 py-2 h-10 gap-2 text-sm shadow-md">
                            <Code size={16} />
                            Developer
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

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

                        <div className="relative mb-3 group">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-[100px] h-[100px] rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center relative cursor-pointer"
                            >
                                <Image src="/images/avatar.png" alt="Avatar" layout="fill" className="object-cover" />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera size={24} className="text-white" />
                                </div>
                            </motion.div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute bottom-0 right-0 bg-[#103B40] text-white p-2 rounded-full shadow-md hover:bg-[#0c2e32] transition-colors"
                            >
                                <Camera size={14} />
                            </motion.button>
                        </div>

                        <p className="text-xs text-center text-gray-400 mb-8 font-medium">
                            Tap camera icon to change avatar<br />Max size: 5MB
                        </p>

                        <div className="flex items-center gap-2 mb-10 w-full justify-center">
                            <div className="bg-white border border-gray-200 rounded px-3 py-2 text-xs text-gray-500 truncate w-[160px] shadow-sm">
                                User ID: user001_1sunx...
                            </div>
                            <motion.button
                                whileHover={{ backgroundColor: "#f9fafb" }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                <Copy size={14} />
                                Copy
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
                                whileHover={{ x: 5, backgroundColor: "#fef2f2" }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-red-500 transition-colors mt-2"
                            >
                                <Trash2 size={16} />
                                <span className="text-sm font-semibold">Delete User</span>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Right Content Area */}
                    <div className="flex-1 relative pl-2 overflow-hidden">
                        {/* Toast Notification */}
                        <AnimatePresence>
                            {showToast && (
                                <motion.div
                                    initial={{ y: -50, opacity: 0, x: "-50%" }}
                                    animate={{ y: 0, opacity: 1, x: "-50%" }}
                                    exit={{ y: -50, opacity: 0, x: "-50%" }}
                                    className="absolute top-0 left-1/2 z-10 w-full max-w-sm"
                                >
                                    <div className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow-xl text-white text-sm font-medium bg-[#1fce81]">
                                        <CheckCircle size={18} />
                                        {activeTab === "password" ? "Password updated successfully!" : "Profile updated successfully!"}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mt-16 w-full pr-10"
                        >
                            {activeTab === "personal" ? (
                                <PersonalDetails onSave={handleSave} />
                            ) : (
                                <ChangePassword onSave={handleSave} onCancel={() => setActiveTab("personal")} />
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

function PersonalDetails({ onSave }: { onSave: () => void }) {
    const [email, setEmail] = useState("maherkojan75othdeinabrav@gmail.com");
    const [emailError, setEmailError] = useState("");

    const handleSave = () => {
        if (email === "taken@gmail.com") {
            setEmailError("Email already in use. Please choose a different email address.");
            return;
        }
        setEmailError("");
        onSave();
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
                    <label className="block text-xs font-semibold text-gray-700 mb-2">First Name</label>
                    <Input defaultValue="Maher" className="bg-white border-none shadow-sm h-11" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Last Name</label>
                    <Input defaultValue="Kojan" className="bg-white border-none shadow-sm h-11" />
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Email Address</label>
                <Input
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    className={`bg-white shadow-sm h-11 transition-all ${emailError ? "border border-red-400 focus:ring-red-200 text-red-500" : "border-none"}`}
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

            <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Phone Number</label>
                <Input defaultValue="+234 3786877583" className="bg-white border-none shadow-sm h-11" />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8 border-b border-[#D3E0E2] pb-10">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Bio</label>
                <textarea
                    className="w-full border-none shadow-sm rounded-md p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white transition-all"
                ></textarea>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h3 className="text-lg font-bold mb-5 text-[#103B40]">Social Media Account</h3>

                <div className="mb-5">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Facebook</label>
                    <Input defaultValue="www.facebook.com/maherkojan" className="bg-white border-none shadow-sm h-11" />
                </div>

                <div className="mb-5">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Instagram</label>
                    <Input defaultValue="www.instagram.com/maherkojan" className="bg-white border-none shadow-sm h-11" />
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 flex justify-end">
                <Button onClick={handleSave} variant="primary" className="bg-[#103B40] hover:bg-[#0c2e32] h-10 shadow-md font-medium px-8 transition-transform hover:scale-105 active:scale-95">
                    Save Changes
                </Button>
            </motion.div>
        </motion.div>
    );
}

function ChangePassword({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("KASFS&^%*%$#");
    const [confirmPassword, setConfirmPassword] = useState("KASFS&^%*%$#");
    const [error, setError] = useState("");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleSave = () => {
        setError("");
        if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        onSave();
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
                <Input defaultValue="maherkojan@gmail.com" className="bg-white border-none shadow-sm h-11 text-gray-500" />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6 mt-2 relative">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Enter Current Password</label>
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e: any) => setPassword(e.target.value)}
                        className="bg-white border-none shadow-sm h-11 text-gray-500 pr-10 transition-all"
                    />
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.button>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4 mt-2 relative">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Confirm Current Password</label>
                <div className="relative">
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e: any) => setConfirmPassword(e.target.value)}
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
                <Button onClick={handleSave} variant="primary" className="flex-1 bg-[#103B40] hover:bg-[#0c2e32] h-10 shadow-md font-medium transition-transform hover:scale-105 active:scale-95">
                    Save
                </Button>
            </motion.div>
        </motion.div>
    );
}