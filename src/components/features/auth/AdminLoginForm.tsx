"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authService } from "@/lib/api/services/auth.service";

export function AdminLoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            await authService.adminLogin({ email, password });
            router.push("/dashboard/admin");
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Invalid admin credentials");
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

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
        >
            <motion.div variants={itemVariants} className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#103B40]/60 bg-[#103B40]/10 px-2.5 py-1 rounded-full">
                    Admin Portal
                </span>
                <h2 className="text-2xl font-semibold text-[#103B40] pt-1">
                    Sign in to Admin Dashboard
                </h2>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <motion.div variants={itemVariants} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 tracking-wide">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                        title="Enter a valid email address"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
                    />
                </motion.div>

                {/* Password */}
                <motion.div variants={itemVariants} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.\-_~+=]).{8,}"
                            title="Must be 8+ characters with uppercase, lowercase, number, and special character"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Remember me */}
                <motion.label variants={itemVariants} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 accent-[#103B40]"
                    />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Remember me
                    </span>
                </motion.label>

                {/* Error */}
                {error && (
                    <motion.p variants={itemVariants} className="text-sm text-red-600 font-medium">{error}</motion.p>
                )}

                {/* Sign In */}
                <motion.button
                    variants={itemVariants}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#103B40] hover:bg-[#0c2f33] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wider py-3 rounded-lg transition-colors cursor-pointer"
                >
                    {loading ? "SIGNING IN..." : "SIGN IN"}
                </motion.button>

                {/* Sign Up */}
                <motion.p variants={itemVariants} className="text-center text-sm text-gray-500">
                    Don&apos;t have an admin account?{" "}
                    <Link
                        href="/admin/register"
                        className="text-[#1a6b5a] font-medium hover:underline"
                    >
                        Sign Up
                    </Link>
                </motion.p>
            </form>
        </motion.div>
    );
}
