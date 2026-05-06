"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Database, Lock, Eye } from "lucide-react";

export default function PrivacyPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const sections = [
        {
            title: "1. Information We Collect",
            icon: <Database size={20} className="text-[#103B40]" />,
            content: "We collect information that you provide directly to us, including your name, email address, phone number, and any other details you choose to share when registering an account or interacting with our services."
        },
        {
            title: "2. How We Use Your Data",
            icon: <Eye size={20} className="text-[#103B40]" />,
            content: "Your data is primarily used to provide, maintain, and improve our services. This includes authenticating your account, processing transactions, sending necessary communications, and personalizing your user experience."
        },
        {
            title: "3. Data Security",
            icon: <Lock size={20} className="text-[#103B40]" />,
            content: "We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. We utilize secure encryption and strict access controls."
        },
        {
            title: "4. Your Privacy Rights",
            icon: <ShieldCheck size={20} className="text-[#103B40]" />,
            content: "You have the right to access, update, or delete your personal information at any time. You may also opt-out of certain data collection practices. If you wish to exercise these rights, please contact our privacy team."
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFA] py-16 px-4 sm:px-6 lg:px-8">
            <motion.div 
                className="max-w-3xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-10 text-center space-y-4">
                    <Link 
                        href="/register" 
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#103B40] transition-colors mb-6 group"
                    >
                        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Sign Up
                    </Link>
                    <div className="w-16 h-16 bg-[#EEF5F5] rounded-2xl mx-auto flex items-center justify-center mb-6">
                        <ShieldCheck size={32} className="text-[#103B40]" />
                    </div>
                    <h1 className="text-4xl font-bold text-[#103B40] tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        We are committed to protecting your personal information. Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                </motion.div>

                {/* Content */}
                <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 sm:p-10 space-y-8">
                        {sections.map((section, index) => (
                            <div key={index} className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#EEF5F5] rounded-lg">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {section.title}
                                    </h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed pl-12">
                                    {section.content}
                                </p>
                            </div>
                        ))}

                        <hr className="border-gray-100" />

                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                Privacy concerns? <br/>
                                Reach out to our Data Protection Officer at <a href="mailto:privacy@thalorix.com" className="text-[#103B40] font-semibold hover:underline">privacy@thalorix.com</a>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
