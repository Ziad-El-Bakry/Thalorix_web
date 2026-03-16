"use client";

import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";
import UserHeader from "@/components/ui/UserHeader";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import OrderSummary from "@/components/features/marketplace/payment/OrderSummary";
import PaymentMethod from "@/components/features/marketplace/payment/PaymentMethod";

export default function PaymentPage() {
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
        <h1 className="text-xl font-bold text-gray-900">Payment</h1>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[500px]"
        >
          
          <OrderSummary />
          <PaymentMethod />

          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-8">
            <Lock size={12} className="text-gray-400" />
            Your payment information is secure and encrypted
          </div>

          <div className="space-y-3">
             <Link href={`/dashboard/marketplace/${id}/payment/success`} className="block w-full">
               <button className="w-full bg-[#123E41] text-white font-bold py-3.5 rounded-xl hover:bg-[#0d2c2e] transition-colors flex justify-center items-center gap-2 shadow-sm">
                 <Lock size={16} />
                 Confirm & pay $58.80
               </button>
             </Link>
             <Link href={`/dashboard/marketplace/${id}`} className="block w-full">
               <button className="w-full bg-[#A5C9D3]/70 text-[#123E41] font-bold py-3.5 rounded-xl hover:bg-[#A5C9D3] transition-colors shadow-sm">
                 Cancel
               </button>
             </Link>
          </div>
          
        </motion.div>
      </div>
    </div>
  );
}
