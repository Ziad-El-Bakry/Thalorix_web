"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function VerifyEmailForm() {
    const searchParams = useSearchParams();
    const email = searchParams?.get("email") || "a*********@g****.com";

    const [otp, setOtp] = useState(["", "", "", "", ""]);
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        // Take only the last character in case of paste or rapid typing
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Move to next input if filled
        if (value && index < 4) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        // Handle Backspace moving to previous input
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 5).replace(/\D/g, "");
        if (pastedData) {
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);
            // Focus the next empty input or the last one
            const nextIndex = Math.min(pastedData.length, 4);
            inputRefs[nextIndex].current?.focus();
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
                    Check your email
                </h2>
                <div className="text-base font-medium text-[#103B40]/80 leading-relaxed max-w-[280px] mx-auto">
                    <p>We&apos;ve sent you a passcode.</p>
                    <p>
                        Please check your inbox at{" "}
                        <span className="font-semibold text-[#103B40]">{email}</span>.
                    </p>
                </div>
            </motion.div>

            <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mt-2">
                {otp.map((digit, index) => (
                    <motion.input
                        variants={itemVariants}
                        key={index}
                        ref={inputRefs[index]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-[45px] h-[55px] sm:w-[50px] sm:h-[60px] md:w-[54px] md:h-[64px] text-center text-xl sm:text-2xl font-bold text-[#103B40] bg-[#a8ccce] rounded-xl border-2 border-transparent focus:bg-white focus:border-[#103B40]/20 focus:outline-none transition-all shadow-sm"
                    />
                ))}
            </div>

            <motion.button
                variants={itemVariants}
                type="button"
                className="text-base font-semibold text-[#103B40] hover:text-[#0c2f33] transition-colors mt-4"
            >
                Resend code
            </motion.button>
        </motion.div>
    );
}
