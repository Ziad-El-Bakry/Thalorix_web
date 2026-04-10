"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Smartphone, ArrowRight, CheckCircle } from "lucide-react";
import { otpService } from "@/lib/api/services/otp.service";
import { AuthLayout } from "@/components/features/auth/AuthLayout";

function ChooseVerificationInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams?.get("email") || "";
    const phone = searchParams?.get("phone") || "";
    const name = searchParams?.get("name") || "";

    const [loading, setLoading] = useState<"email" | "sms" | null>(null);
    const [error, setError] = useState("");

    const maskEmail = (e: string) => {
        const [local, domain] = e.split("@");
        if (!domain) return e;
        return local.slice(0, 2) + "***@" + domain;
    };

    const maskPhone = (p: string) => {
        if (p.length < 6) return p;
        return p.slice(0, 3) + "***" + p.slice(-2);
    };

    const handleChoose = async (method: "email" | "sms") => {
        setError("");
        setLoading(method);
        try {
            if (method === "email") {
                await otpService.sendOtp({
                    type: "email_verification",
                    email,
                    name,
                });
                router.push(`/verify-email?method=email&email=${encodeURIComponent(email)}`);
            } else {
                await otpService.sendOtp({
                    type: "phone_verification",
                    phone,
                    name,
                });
                router.push(`/verify-email?method=sms&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to send code. Please try again.");
        } finally {
            setLoading(null);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.12 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 flex flex-col items-center w-full"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center space-y-3">
                <h2 className="text-[28px] font-bold text-[#103B40] tracking-tight">
                    Verify Your Account
                </h2>
                <p className="text-sm text-gray-500 max-w-[280px] mx-auto leading-relaxed">
                    Choose how you&apos;d like to receive your verification code.
                </p>
            </motion.div>

            {/* Options */}
            <div className="w-full space-y-3 max-w-sm">
                {/* Email Option */}
                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChoose("email")}
                    disabled={!!loading || !email}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-white border-2 border-[#D3E0E2] hover:border-[#103B40] hover:shadow-md transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <div className="w-12 h-12 rounded-xl bg-[#EEF5F5] group-hover:bg-[#103B40] transition-colors flex items-center justify-center flex-shrink-0">
                        {loading === "email" ? (
                            <div className="w-5 h-5 border-2 border-[#103B40] group-hover:border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Mail size={22} className="text-[#103B40] group-hover:text-white transition-colors" />
                        )}
                    </div>
                    <div className="flex-1 text-left">
                        <p className="font-semibold text-sm text-[#103B40]">Send to Email</p>
                        <p className="text-xs text-gray-400 mt-0.5 font-medium">
                            {email ? maskEmail(email) : "No email provided"}
                        </p>
                    </div>
                    <ArrowRight size={18} className="text-gray-300 group-hover:text-[#103B40] transition-colors" />
                </motion.button>

                {/* SMS Option — only visible if phone was provided */}
                {phone ? (
                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChoose("sms")}
                        disabled={!!loading}
                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-white border-2 border-[#D3E0E2] hover:border-[#103B40] hover:shadow-md transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <div className="w-12 h-12 rounded-xl bg-[#EEF5F5] group-hover:bg-[#103B40] transition-colors flex items-center justify-center flex-shrink-0">
                            {loading === "sms" ? (
                                <div className="w-5 h-5 border-2 border-[#103B40] group-hover:border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Smartphone size={22} className="text-[#103B40] group-hover:text-white transition-colors" />
                            )}
                        </div>
                        <div className="flex-1 text-left">
                            <p className="font-semibold text-sm text-[#103B40]">Send via SMS</p>
                            <p className="text-xs text-gray-400 mt-0.5 font-medium">
                                {maskPhone(phone)}
                            </p>
                        </div>
                        <ArrowRight size={18} className="text-gray-300 group-hover:text-[#103B40] transition-colors" />
                    </motion.button>
                ) : (
                    <motion.div
                        variants={itemVariants}
                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 opacity-60 cursor-not-allowed"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Smartphone size={22} className="text-gray-400" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="font-semibold text-sm text-gray-400">Send via SMS</p>
                            <p className="text-xs text-gray-400 mt-0.5">Add a phone number to enable</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Error */}
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 font-medium text-center"
                >
                    {error}
                </motion.p>
            )}

            {/* Info */}
            <motion.div variants={itemVariants} className="flex items-center gap-2 text-xs text-gray-400">
                <CheckCircle size={14} className="text-[#1fce81]" />
                <span>Code expires in 10 minutes</span>
            </motion.div>
        </motion.div>
    );
}

export default function ChooseVerificationPage() {
    return (
        <AuthLayout>
            <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="animate-spin w-7 h-7 rounded-full border-2 border-[#103B40] border-t-transparent" /></div>}>
                <ChooseVerificationInner />
            </Suspense>
        </AuthLayout>
    );
}
