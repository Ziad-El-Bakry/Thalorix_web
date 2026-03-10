"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgetPasswordForm() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        // Here you would typically send the reset email via your API
        setIsSubmitted(true);
    };
    
    if (isSubmitted) {
        return (
            <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-semibold text-[#103B40]">
                    Check your email
                </h2>
                <p className="text-sm text-gray-600 mb-8">
                    We&apos;ve sent a password reset link to <br />
                    <span className="font-medium text-gray-900">{email}</span>
                </p>
                <Link
                    href="/login"
                    className="block w-full bg-[#103B40] hover:bg-[#0c2f33] text-white font-bold text-sm tracking-wider py-3 rounded-lg transition-colors cursor-pointer"
                >
                    BACK TO LOGIN
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-[#103B40]">
                    Forget Password
                </h2>
                <p className="text-sm text-gray-500">
                    Enter your email to receive a password reset link.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 mt-8">
                {/* Email */}
                <div className="space-y-1.5">
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
                </div>

                {/* Submit Reset */}
                <button
                    type="submit"
                    className="w-full bg-[#103B40] hover:bg-[#0c2f33] text-white font-bold text-sm tracking-wider py-3 rounded-lg transition-colors cursor-pointer mt-4"
                >
                    SEND RESET LINK
                </button>

                {/* Back to Login link */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Remember your password?{" "}
                    <Link
                        href="/login"
                        className="text-[#103B40] font-medium hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
