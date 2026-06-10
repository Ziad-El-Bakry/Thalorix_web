"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/lib/api/services/auth.service";

export default function RegisterForm() {
    const [role, setRole] = useState<"user" | "seller">("user");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // Seller specific states
    const [storeName, setStoreName] = useState("");
    const [storeDescription, setStoreDescription] = useState("");
    const [address, setAddress] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setError("");
        setLoading(true);
        
        try {
            let formattedPhone = phone;
            // Automatically convert Egyptian local numbers (01...) to international (+201...)
            if (formattedPhone.startsWith("01") && formattedPhone.length === 11) {
                formattedPhone = "+2" + formattedPhone;
            } else if (!formattedPhone.startsWith("+")) {
                // Prepend + if the user forgot it for other international numbers
                formattedPhone = "+" + formattedPhone;
            }

            if (role === "user") {
                await authService.register({ username, email, phone: formattedPhone, password, confirmPassword });
            } else {
                await authService.registerSeller({
                    username,
                    email,
                    phone: formattedPhone,
                    password,
                    confirmPassword,
                    storeName: storeName || undefined,
                    storeDescription: storeDescription || undefined,
                    address: address || undefined,
                });
            }

            const params = new URLSearchParams({ email });
            if (phone) params.set("phone", phone);
            if (username) params.set("name", username);
            router.push(`/choose-verification?${params.toString()}`);
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Registration failed");
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
            <motion.h2 variants={itemVariants} className="text-2xl font-semibold text-[#103B40] text-center">
                Sign Up
            </motion.h2>

            {/* Modern Sliding Underline Tab Swapper */}
            <motion.div 
                variants={itemVariants} 
                className="flex border-b border-[#D3E0E2] w-full mb-6 relative"
            >
                <button
                    type="button"
                    onClick={() => setRole("user")}
                    className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 relative cursor-pointer ${
                        role === "user" ? "text-[#103B40] scale-[1.03]" : "text-gray-400 hover:text-[#103B40]/70"
                    }`}
                >
                    User
                    {role === "user" && (
                        <motion.div
                            layoutId="activeTabUnderline"
                            className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#103B40] rounded-full shadow-[0_1px_8px_rgba(16,59,64,0.4)]"
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => setRole("seller")}
                    className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 relative cursor-pointer ${
                        role === "seller" ? "text-[#103B40] scale-[1.03]" : "text-gray-400 hover:text-[#103B40]/70"
                    }`}
                >
                    Seller
                    {role === "seller" && (
                        <motion.div
                            layoutId="activeTabUnderline"
                            className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#103B40] rounded-full shadow-[0_1px_8px_rgba(16,59,64,0.4)]"
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                    )}
                </button>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <motion.div variants={itemVariants} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 tracking-wide">
                        Full Name
                    </label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        pattern="^[a-zA-Z\s\u0600-\u06FF]+$"
                        title="Name must contain only letters (Arabic or English) without numbers or symbols"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
                    />
                </motion.div>

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

                {/* Phone */}
                <motion.div variants={itemVariants} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 tracking-wide">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        placeholder="+2..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
                    />
                </motion.div>

                {/* Seller Specific Fields wrapped in Framer Motion AnimatePresence with vertical & horizontal slide */}
                <AnimatePresence mode="wait">
                    {role === "seller" && (
                        <motion.div
                            key="seller-inputs"
                            initial={{ opacity: 0, height: 0, x: 25 }}
                            animate={{ opacity: 1, height: "auto", x: 0 }}
                            exit={{ opacity: 0, height: 0, x: -25 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="space-y-5 overflow-hidden"
                        >
                            {/* Store Name */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-gray-700 tracking-wide">
                                    Store Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Thalorix Market"
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                    required={role === "seller"}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
                                />
                            </div>

                            {/* Store Description */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-gray-700 tracking-wide">
                                    Store Description
                                </label>
                                <textarea
                                    placeholder="Describe your business and products..."
                                    value={storeDescription}
                                    onChange={(e) => setStoreDescription(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 transition min-h-[80px] resize-y"
                                />
                            </div>

                            {/* Store Address */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-gray-700 tracking-wide">
                                    Store Address
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 123 Nile St, Cairo, Egypt"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Password */}
                <motion.div variants={itemVariants} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 tracking-wide">
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

                {/* Confirm Password */}
                <motion.div variants={itemVariants} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 tracking-wide">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.\-_~+=]).{8,}"
                            title="Must match password: 8+ characters with uppercase, lowercase, number, and special character"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? (
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

                {/* Terms */}
                <motion.p variants={itemVariants} className="text-xs text-gray-600">
                    By continuing, you agree to our{" "}
                    <Link href="/terms" className="text-[#103B40] font-medium underline">
                        Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#103B40] font-medium underline">
                        Privacy Policy
                    </Link>
                    .
                </motion.p>

                {/* Error */}
                {error && (
                    <motion.p variants={itemVariants} className="text-sm text-red-600 font-medium">{error}</motion.p>
                )}

                {/* Register */}
                <motion.button
                    variants={itemVariants}
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-[#103B40] hover:bg-[#0c2f33] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wider py-3 rounded-lg transition-colors cursor-pointer ${loading ? 'animate-pulse' : ''}`}
                >
                    {loading ? "REGISTERING..." : "REGISTER"}
                </motion.button>

                {/* Sign In link */}
                <motion.p variants={itemVariants} className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-[#103B40] font-medium hover:underline"
                    >
                        Sign In
                    </Link>
                </motion.p>
            </form>
        </motion.div>
    );
}