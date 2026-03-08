"use client";

import { useState, useRef, KeyboardEvent } from "react";

export default function VerifyEmailForm() {
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

    return (
        <div className="space-y-8 flex flex-col items-center max-w-[320px] mx-auto">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-[#103B40]">
                    Check your email
                </h2>
                <div className="text-sm font-medium text-[#103B40] leading-relaxed">
                    <p>We&apos;ve sent you a passcode.</p>
                    <p>
                        Please check your inbox at{" "}
                        <span className="font-semibold text-gray-800">a*********@g****.com</span>.
                    </p>
                </div>
            </div>

            <div className="flex justify-center gap-3 md:gap-4 mt-6">
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
                        className="w-12 h-14 text-center text-xl font-bold text-[#103B40] bg-[#a8ccce] rounded-lg border-2 border-transparent focus:bg-white focus:border-[#4285F4] focus:outline-none transition-all shadow-sm shadow-[#a8ccce]/50"
                    />
                ))}
            </div>

            <button
                type="button"
                className="text-sm font-medium text-[#103B40] hover:text-[#0c2f33] hover:underline transition-colors mt-8"
            >
                Resend code
            </button>
        </div>
    );
}
