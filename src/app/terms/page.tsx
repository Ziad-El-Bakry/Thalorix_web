"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Shield, UserCheck, Scale } from "lucide-react";

export default function TermsPage() {
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
            title: "1. Acceptance of Terms",
            icon: <FileText size={20} className="text-[#103B40]" />,
            content: "By accessing and using Thalorix, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and such modifications shall be effective immediately upon posting."
        },
        {
            title: "2. User Responsibilities",
            icon: <UserCheck size={20} className="text-[#103B40]" />,
            content: "You are responsible for maintaining the confidentiality of your account credentials. Any activities that occur under your account are your sole responsibility. You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of others."
        },
        {
            title: "3. Privacy & Data Protection",
            icon: <Shield size={20} className="text-[#103B40]" />,
            content: "Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using Thalorix, you consent to our data practices as described in the Privacy Policy."
        },
        {
            title: "4. Limitations of Liability",
            icon: <Scale size={20} className="text-[#103B40]" />,
            content: "Thalorix shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service. We provide the service on an 'as is' and 'as available' basis without warranties of any kind."
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
                        <FileText size={32} className="text-[#103B40]" />
                    </div>
                    <h1 className="text-4xl font-bold text-[#103B40] tracking-tight">
                        Terms of Service
                    </h1>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Please read these terms carefully before using Thalorix. Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
                                Have questions about our terms? <br/>
                                Contact our support team at <a href="mailto:support@thalorix.com" className="text-[#103B40] font-semibold hover:underline">support@thalorix.com</a>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
