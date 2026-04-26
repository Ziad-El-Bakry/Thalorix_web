"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Smartphone, RefreshCw, CheckCircle } from "lucide-react";
import { otpService } from "@/lib/api/services/otp.service";

const OTP_LENGTH = 6;

export default function VerifyEmailForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams?.get("email") || "";
    const phone = searchParams?.get("phone") || "";
    const method = (searchParams?.get("method") || "email") as "email" | "sms";

    const isSms = method === "sms";
    const otpType = isSms ? "phone_verification" : "email_verification";
    const maskedTarget = isSms
        ? (phone.length > 5 ? phone.slice(0, 3) + "***" + phone.slice(-2) : phone)
        : (email ? email.slice(0, 2) + "***@" + email.split("@")[1] : "");

    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [resent, setResent] = useState(false);

    const inputRefs = Array.from({ length: OTP_LENGTH }, () => useRef<HTMLInputElement>(null));

    const verifyOtp = async () => {
        const code = otp.join("");
        if (code.length !== OTP_LENGTH) return;
        setError("");
        setLoading(true);
        try {
            await otpService.verifyOtp({
                code,
                type: otpType,
                ...(isSms ? { phone } : { email }),
            });
            router.push("/login?verified=true");
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Invalid or expired OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError("");
        setResending(true);
        setResent(false);
        try {
            // Simulate a short delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // The backend /otp/resend endpoint returns 404 because it is not implemented.
            // Since the OTP is only generated and returned during the initial /register call,
            // we cannot request a new one here.
            setError("Resend is currently unavailable. Please register again to get a new code.");
            
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to resend code.");
        } finally {
            setResending(false);
        }
    };

    const handleChange = (index: number, value: string) => {
        if (value && !/^\d+$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < OTP_LENGTH - 1) inputRefs[index + 1].current?.focus();
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").slice(0, OTP_LENGTH).replace(/\D/g, "");
        if (!pasted) return;
        const newOtp = [...otp];
        for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
        setOtp(newOtp);
        inputRefs[Math.min(pasted.length, OTP_LENGTH - 1)].current?.focus();
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
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
            className="space-y-10 flex flex-col items-center w-full"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF5F5] flex items-center justify-center mx-auto">
                    {isSms
                        ? <Smartphone size={28} className="text-[#103B40]" />
                        : <Mail size={28} className="text-[#103B40]" />
                    }
                </div>
                <h2 className="text-[28px] font-bold text-[#103B40] tracking-tight">
                    {isSms ? "Check your phone" : "Check your email"}
                </h2>
                <div className="text-sm font-medium text-[#103B40]/70 leading-relaxed max-w-[280px] mx-auto">
                    <p>We&apos;ve sent a {OTP_LENGTH}-digit code to</p>
                    <p className="font-semibold text-[#103B40] mt-0.5">{maskedTarget}</p>
                </div>
            </motion.div>

            {/* OTP Inputs */}
            <motion.div variants={itemVariants} className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={inputRefs[index]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-[44px] h-[54px] sm:w-[48px] sm:h-[58px] text-center text-xl font-bold text-[#103B40] bg-[#a8ccce] rounded-xl border-2 border-transparent focus:bg-white focus:border-[#103B40]/30 focus:outline-none transition-all shadow-sm"
                    />
                ))}
            </motion.div>

            {/* Errors & Resent confirmation */}
            <AnimatePresence mode="wait">
                {error && (
                    <motion.p
                        key="error"
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-sm text-red-500 font-medium text-center -mt-4"
                    >
                        {error}
                    </motion.p>
                )}
                {resent && (
                    <motion.div
                        key="resent"
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 text-sm text-[#1fce81] font-semibold -mt-4"
                    >
                        <CheckCircle size={15} /> New code sent!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Actions */}
            <motion.div variants={itemVariants} className="w-full flex flex-col items-center gap-3">
                <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={loading || otp.join("").length !== OTP_LENGTH}
                    className="w-full max-w-[280px] bg-[#103B40] hover:bg-[#0c2f33] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wider py-3 rounded-xl transition-colors"
                >
                    {loading ? "VERIFYING..." : "VERIFY"}
                </button>

                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="flex items-center gap-2 text-sm font-semibold text-[#103B40] hover:text-[#0c2f33] transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={14} className={resending ? "animate-spin" : ""} />
                    {resending ? "Sending..." : "Resend code"}
                </button>
            </motion.div>
        </motion.div>
    );
}
