"use client";

import UserHeader from "@/components/ui/UserHeader";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Download, History } from "lucide-react";
import { usePurchaseStore } from "@/store/usePurchaseStore";
import Image from "next/image";

const isValidImage = (src?: string) => {
  if (!src) return false;
  if (src.startsWith("/mnt/")) return false;
  return true;
};

export default function HistoryPage() {
  const { purchasedItems } = usePurchaseStore();

  return (
    <div className="-m-4 md:-m-6 lg:-m-10 p-4 md:p-6 lg:p-10 bg-[#E2E3EA] min-h-[calc(100vh-60px)]">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col h-full">
        <div className="border-b-2 border-[#b0c4c4] pb-2 mb-4 relative z-50">
          <UserHeader compact={true} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center mb-6 relative justify-center"
        >
          <Link
            href="/dashboard/marketplace"
            className="absolute left-0 w-10 h-10 bg-[#123E41] text-white rounded-full flex items-center justify-center hover:bg-[#0d2c2e] transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-[#103B40] flex items-center gap-2">
            <History size={24} />
            Purchase History
          </h1>
        </motion.div>

        {purchasedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[20px] shadow-sm border border-teal-50">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-4">
              <History size={32} className="text-[#123E41]" />
            </div>
            <h2 className="text-xl font-bold text-[#103B40] mb-2">No purchases yet</h2>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              You haven't acquired any templates. Go to the marketplace to find templates for your next project.
            </p>
            <Link href="/dashboard/marketplace">
              <button className="bg-[#123E41] text-white px-6 py-3 rounded-xl hover:bg-[#0d2c2e] transition-colors font-medium">
                Browse Marketplace
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {purchasedItems.map((item) => {
              const imagePath = item.image || item.imageUrl;
              const hasValidImage = isValidImage(imagePath);

              return (
                <motion.div 
                  key={item.id || item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[20px] overflow-hidden p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-teal-50 flex flex-col h-full"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-gray-100">
                    {hasValidImage ? (
                      <Image src={imagePath as string} alt={item.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[#E2E3EA] text-sm">No Cover</div>
                    )}
                  </div>
                <div className="px-1 mb-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-[#103B40] text-lg leading-tight mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-gray-500 mb-3 flex-1">{item.description}</p>
                </div>
                <div className="mt-auto">
                  {item.fileUrl ? (
                    <a href={item.fileUrl} download target="_blank" rel="noopener noreferrer" className="block w-full">
                      <button className="w-full bg-[#A5C9D3]/30 text-[#123E41] py-3 rounded-xl hover:bg-[#A5C9D3]/50 transition-colors font-semibold text-sm flex justify-center items-center gap-2">
                        <Download size={18} />
                        Download Template
                      </button>
                    </a>
                  ) : (
                    <button disabled className="w-full bg-gray-100 text-gray-400 py-3 rounded-xl font-medium text-sm flex justify-center items-center gap-2 cursor-not-allowed">
                      File Unavailable
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}
