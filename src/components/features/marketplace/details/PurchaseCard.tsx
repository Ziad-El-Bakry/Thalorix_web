"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";

interface PurchaseCardProps {
  id: string;
}

export default function PurchaseCard({ id }: PurchaseCardProps) {
  const isFree = id === "2" || id === "5"; // Make 2 and 5 free for mock testing
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6 border border-teal-50">
        <div className="flex items-end gap-3 justify-center mb-6">
           <span className="text-3xl font-bold text-gray-900">{isFree ? "Free" : "$30"}</span>
           {!isFree && <span className="text-lg text-gray-400 line-through mb-1">$50</span>}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-teal-50/50 rounded-xl p-3 border border-teal-50">
            <p className="text-xs text-gray-500 mb-1">File Format</p>
            <p className="text-sm font-semibold text-[#103B40]">PPTX, KEY</p>
          </div>
          <div className="bg-teal-50/50 rounded-xl p-3 border border-teal-50">
            <p className="text-xs text-gray-500 mb-1">File Size</p>
            <p className="text-sm font-semibold text-[#103B40]">12.5 MB</p>
          </div>
          <div className="bg-teal-50/50 rounded-xl p-3 border border-teal-50">
            <p className="text-xs text-gray-500 mb-1">Dimensions</p>
            <p className="text-sm font-semibold text-[#103B40]">16:9 Ratio</p>
          </div>
          <div className="bg-teal-50/50 rounded-xl p-3 border border-teal-50">
            <p className="text-xs text-gray-500 mb-1">License</p>
            <p className="text-sm font-semibold text-[#103B40]">Commercial</p>
          </div>
        </div>

        <div className="space-y-3">
          <Link href={isFree ? `/dashboard/marketplace/${id}/payment/success` : `/dashboard/marketplace/${id}/payment`} className="block w-full">
            <button className="w-full bg-[#123E41] text-white py-3.5 rounded-xl hover:bg-[#0d2c2e] transition-colors font-medium">
              {isFree ? "Download for Free" : "Buy Template - $30"}
            </button>
          </Link>
          <button className="w-full bg-[#A5C9D3]/30 text-[#123E41] py-3.5 rounded-xl hover:bg-[#A5C9D3]/50 transition-colors font-medium flex items-center justify-center gap-2">
            <Eye size={18} />
            Preview
          </button>
        </div>
      </div>
    </motion.div>
  );
}
