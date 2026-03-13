"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgetPasswordForm() {
    const [email, setEmail] = useState("");
    const router = useRouter();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        // Here you would typically send the reset email via your API
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    };

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
