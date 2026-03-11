"use client";

import { ReactNode } from "react";
import Image from "next/image";
import NavigationLoader from "@/components/layout/NavigationLoader";

interface AuthLayoutProps {
    children: ReactNode;
    variant?: "default" | "verify";
}

export function AuthLayout({ children, variant = "default" }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d2f33] p-4">
            <div className="flex w-full max-w-[900px] min-h-[560px] rounded-2xl overflow-hidden shadow-2xl">
                {/* Left Panel – Branding */}
                <div className="hidden md:flex w-[42%] bg-[#103B40] flex-col items-center justify-between p-10 relative">

                    {variant === "default" ? (
                        <>
                            {/* Logo */}
                            <h1 className="self-start text-white text-xl font-bold tracking-widest">
                                THALORIX
                            </h1>

                            {/* Profile images with orbit */}
                            <div className="relative w-60 h-60 flex items-center justify-center -translate-y-4">
                                {/* Dotted orbit ring */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg
                                        viewBox="0 0 240 240"
                                        className="w-full h-full"
                                        fill="none"
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
                                    </svg>
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
                            </div>

                            {/* Tagline */}
                            <h2 className="text-white text-xl font-semibold text-center leading-snug">
                                Skip the syntax<br />
                                Keep the logic.
                            </h2>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full w-full">
                            <div className="w-96 h-96 relative">
                                <Image
                                    src="/images/Thalorix.png"
                                    alt="Thalorix Logo"
                                    fill
                                    className="object-contain drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                                    priority
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel – Form */}
                <div className="flex-1 bg-[#eef1f5] flex items-center justify-center p-8 md:p-12">
                    <div className="w-full max-w-sm">
                        <NavigationLoader>{children}</NavigationLoader>
                    </div>
                </div>
            </div>
        </div>
    );
}