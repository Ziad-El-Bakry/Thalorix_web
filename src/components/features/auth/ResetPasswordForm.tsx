"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authService } from "@/lib/api/services/auth.service";
import { Eye, EyeOff } from "lucide-react";

export function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams?.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Missing reset token. Please restart the password reset process.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    if (success) {
        return (
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6 text-center">
                <motion.div variants={itemVariants} className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </motion.div>
                <motion.h2 variants={itemVariants} className="text-2xl font-bold text-[#103B40]">Password Reset!</motion.h2>
                <motion.p variants={itemVariants} className="text-gray-500">Your password has been successfully reset.</motion.p>
                <motion.p variants={itemVariants} className="text-sm text-gray-400">Redirecting to login...</motion.p>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
        >
            <motion.div variants={itemVariants} className="text-center space-y-2">
                <h2 className="text-[32px] font-bold text-[#103B40] tracking-tight">
                    New Password
                </h2>
                <p className="text-sm text-gray-500">
                    Enter your new password below.
                </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5 mt-8">
                {/* New Password */}
                <motion.div variants={itemVariants} className="space-y-1.5 relative">
                    <label className="block text-xs font-semibold text-gray-700 tracking-wide">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 transition pr-10"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </motion.div>

                {/* Confirm Password */}
                <motion.div variants={itemVariants} className="space-y-1.5 relative">
                    <label className="block text-xs font-semibold text-gray-700 tracking-wide">
                        Confirm Password
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
                    />
                </motion.div>

                {/* Error */}
                {error && (
                    <motion.p variants={itemVariants} className="text-sm text-red-600 font-medium mt-2">{error}</motion.p>
                )}

                {/* Submit Reset */}
                <motion.button
                    variants={itemVariants}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#103B40] hover:bg-[#0c2f33] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wider py-3 rounded-lg transition-colors cursor-pointer mt-4"
                >
                    {loading ? "SAVING..." : "RESET PASSWORD"}
                </motion.button>
            </form>
        </motion.div>
    );
}
