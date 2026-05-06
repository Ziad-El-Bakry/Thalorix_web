"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import UserHeader from "@/components/ui/UserHeader";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import ImageGallery from "@/components/features/marketplace/details/ImageGallery";
import TemplateInfo from "@/components/features/marketplace/details/TemplateInfo";
import ReviewList from "@/components/features/marketplace/details/ReviewList";
import PurchaseCard from "@/components/features/marketplace/details/PurchaseCard";

export default function MarketplaceDetails() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id || "1");

  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col h-full overflow-y-auto custom-scrollbar pb-10">
      <div className="border-b-2 border-[#b0c4c4] pb-2 mb-4 relative z-50">
        <UserHeader name="User" badge="Developer" compact />
      </div>

      {/* Header */}
      <div className="flex items-center mb-6 mt-2 relative justify-center">
        <Link
          href="/dashboard/marketplace"
          className="absolute left-0 w-10 h-10 bg-[#123E41] text-white rounded-full flex items-center justify-center hover:bg-[#0d2c2e] transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Template Details</h1>
      </div>

      <ImageGallery />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          <TemplateInfo />
          <ReviewList />
        </motion.div>

        {/* Right Column - Purchase Card */}
        <PurchaseCard id={id} />
      </div>
    </div>
  );
}