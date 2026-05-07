"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, Check, Mail, X } from "lucide-react";
import UserHeader from "@/components/ui/UserHeader";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentSuccessPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id || "1");
  const isFree = id === "2" || id === "5";
  const [showReceipt, setShowReceipt] = useState(false);

  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col h-full overflow-y-auto custom-scrollbar pb-10">
      <div className="border-b-2 border-[#b0c4c4] pb-2 mb-4 relative z-50">
        <UserHeader name="User" badge="Developer" compact />
      </div>

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
          {isFree ? "Template Downloaded" : "Payment Completed"}<br/>Successfully
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-[#103B40]/70 text-center max-w-[340px] mb-8 font-medium"
        >
          {isFree ? "Your template has been added to your library." : "Your payment has been processed and the template has been added to your library."}
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
              <span className="text-gray-900 font-medium w-32">{isFree ? "Total Cost" : "Amount Paid"}</span>
              <span className="font-bold text-gray-900 text-right text-base">{isFree ? "$0.00" : "$58.80"}</span>
            </div>
          </div>
        </motion.div>

        <div className="w-full max-w-[460px] space-y-3">
          <Link href="/dashboard/marketplace" className="block w-full bg-[#123E41] text-white font-bold py-3.5 rounded-xl hover:bg-[#0d2c2e] transition-colors shadow-sm text-center">
            Go to My Library
          </Link>
          <button onClick={() => setShowReceipt(true)} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-[#123E41] font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-center">
            <Mail size={18} /> View Email Receipt
          </button>
          <Link href={`/dashboard/marketplace/${id}`} className="block w-full bg-[#A5C9D3]/30 text-[#123E41] font-bold py-3.5 rounded-xl hover:bg-[#A5C9D3]/50 transition-colors shadow-sm text-center">
            View Template
          </Link>
        </div>
      </div>

      {/* Mock Email Receipt Modal */}
      <AnimatePresence>
        {showReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowReceipt(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-gray-100 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Email App Header mock */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">T</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-none">Thalorix Marketplace</p>
                    <p className="text-xs text-gray-500 mt-0.5">receipts@thalorix.com</p>
                  </div>
                </div>
                <button onClick={() => setShowReceipt(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              {/* Email Body */}
              <div className="p-8 bg-white m-4 rounded-xl shadow-sm border border-gray-200">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-[#103B40] mb-2">Your Receipt</h2>
                  <p className="text-gray-500 text-sm">Thank you for your {isFree ? "download" : "purchase"}!</p>
                </div>
                
                <div className="space-y-4 text-sm mb-8 text-left">
                   <p className="text-gray-700">Hi Developer,</p>
                   <p className="text-gray-700">We have successfully processed your {isFree ? "request" : "payment"}. The template "Business Dashboard UI Kit" is now available in your library.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-8 text-left">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500 text-sm">Order ID</span>
                    <span className="font-bold text-gray-900 text-sm">TXN-2847563</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500 text-sm">Date</span>
                    <span className="font-bold text-gray-900 text-sm">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                    <span className="text-gray-500 font-bold text-sm mt-1">Total</span>
                    <span className="font-bold text-[#103B40] text-xl">{isFree ? "$0.00" : "$58.80"}</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <button onClick={() => setShowReceipt(false)} className="bg-[#103B40] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#0d2c2e] transition-colors shadow-sm">Close Receipt</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
