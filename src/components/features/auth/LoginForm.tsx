"use client";

import { useState } from "react";
import Link from "next/link";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-[#103B40]">
                Login to your Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
                    />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
                    />
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="text-xs text-[#103B40] hover:underline"
                        >
                            Forget Password?
                        </button>
                    </div>
                </div>

                {/* Remember me */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 accent-[#103B40]"
                    />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Remember me
                    </span>
                </label>

                {/* Sign In */}
                <button
                    type="submit"
                    className="w-full bg-[#103B40] hover:bg-[#0c2f33] text-white font-bold text-sm tracking-wider py-3 rounded-lg transition-colors cursor-pointer"
                >
                    SIGN IN
                </button>

                {/* Google */}
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 bg-[#1a6b5a] hover:bg-[#15594b] text-white font-medium text-sm py-3 rounded-full transition-colors cursor-pointer"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google
                </button>

                {/* Sign Up */}
                <p className="text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-[#1a6b5a] font-medium hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
}