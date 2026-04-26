"use client";

import { ReactNode } from "react";
import Image from "next/image";
import NavigationLoader from "@/components/layout/NavigationLoader";
import { motion } from "framer-motion";

interface AuthLayoutProps {
    children: ReactNode;
    variant?: "default" | "verify";
}

export function AuthLayout({ children, variant = "default" }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d2f33] p-4">
            <div className="flex w-full max-w-[1100px] min-h-[560px] rounded-2xl overflow-hidden shadow-2xl">
                {/* Left Panel – Branding */}
                <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="hidden md:flex w-[42%] bg-[#103B40] flex-col items-center justify-between p-10 relative"
                >

                    {variant === "default" ? (
                        <>
                            {/* Logo */}
                            <motion.h1 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="self-start text-white text-xl font-bold tracking-widest"
                            >
                                THALORIX
                            </motion.h1>

                            {/* Profile images with orbit */}
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="relative w-60 h-60 flex items-center justify-center -translate-y-4"
                            >
                                {/* Dotted orbit ring */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.svg
                                        viewBox="0 0 240 240"
                                        className="w-full h-full"
                                        fill="none"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    >
                                        <ellipse
                                            cx="120"
                                            cy="120"
                                            rx="100"
                                            ry="100"
                                            stroke="rgba(255,255,255,0.25)"
                                            strokeWidth="1.5"
                                            strokeDasharray="6 6"
                                        />
                                    </motion.svg>
                                </div>

                                {/* Top profile */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                                    <Image
                                        src="/images/profile1.png"
                                        alt="User 1"
                                        width={80}
                                        height={80}
                                        className="object-cover w-full h-full"
                                    />
                                </div>

                                {/* Bottom-left profile */}
                                <div className="absolute bottom-4 left-2 w-20 h-20 rounded-full overflow-hidden border-2 border-teal-400/50 shadow-lg">
                                    <Image
                                        src="/images/profile2.png"
                                        alt="User 2"
                                        width={80}
                                        height={80}
                                        className="object-cover w-full h-full"
                                    />
                                </div>

                                {/* Bottom-right profile */}
                                <div className="absolute bottom-4 right-2 w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                                    <Image
                                        src="/images/profile3.png"
                                        alt="User 3"
                                        width={80}
                                        height={80}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </motion.div>

                            {/* Tagline */}
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-white text-xl font-semibold text-center leading-snug"
                            >
                                Skip the syntax<br />
                                Keep the logic.
                            </motion.h2>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full w-full">
                            <motion.div 
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.7, delay: 0.8 }}
                                className="w-90 h-90 relative"
                            >
                                <Image
                                    src="/images/thalorix.png"
                                    alt="Thalorix Logo"
                                    fill
                                    className="object-contain drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                                    priority
                                />
                            </motion.div>
                        </div>
                    )}
                </motion.div>

                {/* Right Panel – Form */}
                <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    className="flex-1 bg-[#eef1f5] flex items-center justify-center p-4 sm:p-8 md:p-12 relative overflow-y-auto"
                >
                    <div className={`w-full ${variant === 'verify'
                        ? 'max-w-xl bg-white/70 backdrop-blur-md rounded-[30px] sm:rounded-[50px] p-8 sm:p-12 md:p-20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] border border-white/50 m-4'
                        : 'max-w-sm'
                        }`}>
                        <NavigationLoader>{children}</NavigationLoader>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}