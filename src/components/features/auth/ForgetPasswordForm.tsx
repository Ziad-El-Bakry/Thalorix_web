"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authService } from "@/lib/api/services/auth.service";

export default function ForgetPasswordForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Failed to process request");
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
            <motion.div variants={itemVariants} className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-[#103B40]">
                    Forget Password
                </h2>
                <p className="text-sm text-gray-500">
                    Enter your email to receive a password reset link.
                </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5 mt-8">
                {/* Email */}
                <motion.div variants={itemVariants} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 tracking-wide">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                        title="Enter a valid email address (e.g. user@example.com)"
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
                    {loading ? "SENDING LINK..." : "SEND RESET LINK"}
                </motion.button>

                {/* Back to Login link */}
                <motion.p variants={itemVariants} className="text-center text-sm text-gray-500 mt-6">
                    Remember your password?{" "}
                    <Link
                        href="/login"
                        className="text-[#103B40] font-medium hover:underline"
                    >
                        Login
                    </Link>
                </motion.p>
            </form>
        </motion.div>
    );
}
