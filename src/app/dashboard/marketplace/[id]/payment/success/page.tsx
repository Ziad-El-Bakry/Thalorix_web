"use client";

import Link from "next/link";
import { ChevronLeft, Check } from "lucide-react";
import UserHeader from "@/components/ui/UserHeader";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function PaymentSuccessPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id || "1");

  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col h-full overflow-y-auto custom-scrollbar pb-10">
      <UserHeader name="User" badge="Developer" />

      {/* Header */}
      <div className="flex items-center mb-8 relative justify-center">
        <Link 
          href={`/dashboard/marketplace/${id}`}
          className="absolute left-0 w-10 h-10 bg-[#123E41] text-white rounded-full flex items-center justify-center hover:bg-[#0d2c2e] transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Payment Status</h1>
      </div>

      <div className="flex-1 flex flex-col items-center mt-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
        >
          <Check className="text-green-500" size={48} strokeWidth={3} />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-[#103B40] mb-2 text-center"
        >
          Payment Completed<br/>Successfully
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-[#103B40]/70 text-center max-w-[340px] mb-8 font-medium"
        >
          Your payment has been processed and the template has been added to your library
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="w-full max-w-[460px] bg-white rounded-2xl shadow-sm border border-gray-50 mb-8 overflow-hidden"
        >
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-900 font-medium w-32">Template</span>
              <span className="font-bold text-gray-900 text-right">Business Dashboard UI Kit</span>
            </div>
            
            <div className="h-px w-full bg-gray-100"></div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-900 font-medium w-32">Transaction ID</span>
              <span className="font-bold text-gray-900 text-right">TXN-2847563</span>
            </div>
            
            <div className="h-px w-full border-t-2 border-dashed border-gray-100"></div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-900 font-medium w-32">Amount Paid</span>
              <span className="font-bold text-gray-900 text-right text-base">$49.00</span>
            </div>
          </div>
        </motion.div>

        <div className="w-full max-w-[460px] space-y-3">
          <Link href="/dashboard/marketplace" className="block w-full bg-[#123E41] text-white font-bold py-3.5 rounded-xl hover:bg-[#0d2c2e] transition-colors shadow-sm text-center">
            Go to My Library
          </Link>
          <Link href={`/dashboard/marketplace/${id}`} className="block w-full bg-[#A5C9D3]/70 text-[#123E41] font-bold py-3.5 rounded-xl hover:bg-[#A5C9D3] transition-colors shadow-sm text-center">
            View Template
          </Link>
        </div>
      </div>
    </div>
  );
}
