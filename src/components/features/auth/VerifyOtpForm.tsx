"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authService } from "@/lib/api/services/auth.service";

export function VerifyOtpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams?.get("email") || "";

    const OTP_LENGTH = 6;
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    // Create an array of refs
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const type = searchParams?.get("type") || "";

    const verifyOtp = async () => {
        const code = otp.join("");
        if (code.length !== OTP_LENGTH) return;
        
        if (!email) {
            setError("Email is missing. Please try again.");
            return;
        }

        setError("");
        setLoading(true);
        try {
            await authService.verifyOtp({ email, otp: code });
            if (type === "reset") {
                router.push(`/reset-password?token=${code}`);
            } else {
                router.push("/dashboard"); // Redirect on success
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Failed to verify OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (index: number, value: string) => {
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (pastedData) {
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);
            const nextIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
            inputRefs.current[nextIndex]?.focus();
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
            className="space-y-12 flex flex-col items-center w-full"
        >
            <motion.div variants={itemVariants} className="text-center space-y-6">
                <h2 className="text-[32px] font-bold text-[#103B40] tracking-tight">
                    Verify OTP
                </h2>
                <div className="text-base font-medium text-[#103B40]/80 leading-relaxed max-w-[280px] mx-auto">
                    <p>We&apos;ve sent an OTP code.</p>
                    {email ? (
                        <p>
                            Please check your inbox at{" "}
                            <span className="font-semibold text-[#103B40]">{email}</span>
                        </p>
                    ) : (
                        <p className="text-red-500">Email not found in URL.</p>
                    )}
                </div>
            </motion.div>

            <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mt-2">
                {otp.map((digit, index) => (
                    <motion.input
                        variants={itemVariants}
                        key={index}
                        ref={(el: any) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-[40px] h-[50px] sm:w-[45px] sm:h-[55px] md:w-[50px] md:h-[60px] text-center text-xl sm:text-2xl font-bold text-[#103B40] bg-[#a8ccce] rounded-xl border-2 border-transparent focus:bg-white focus:border-[#103B40]/20 focus:outline-none transition-all shadow-sm"
                    />
                ))}
            </div>

            {error && (
                <motion.p variants={itemVariants} className="text-sm text-red-600 font-medium">{error}</motion.p>
            )}

            <motion.div variants={itemVariants} className="w-full flex flex-col items-center gap-4 mt-6">
                <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={loading || otp.join("").length !== OTP_LENGTH}
                    className="w-full max-w-[280px] bg-[#103B40] hover:bg-[#0c2f33] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wider py-3 rounded-lg transition-colors cursor-pointer"
                >
                    {loading ? "VERIFYING..." : "VERIFY OTP"}
                </button>
                
                <button
                    type="button"
                    className="text-base font-semibold text-[#103B40] hover:text-[#0c2f33] transition-colors"
                >
                    Resend code
                </button>
            </motion.div>
        </motion.div>
    );
}
