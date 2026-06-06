"use client";

import Link from "next/link";
import { ChevronLeft, Lock, CreditCard, Info, AlertCircle } from "lucide-react";
import UserHeader from "@/components/ui/UserHeader";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import OrderSummary from "@/components/features/marketplace/payment/OrderSummary";
import { useState, useEffect } from "react";
import { Template } from "@/types";
import { templatesService } from "@/lib/api/services/templates.service";
import { api } from "@/lib/api/axios";
import { useAuthStore } from "@/store/useAuthStore";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id || "1");
  const { user } = useAuthStore();
  const isCancelled = searchParams?.get("cancelled") === "true";
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const data = await templatesService.getById(id);
        setTemplate(data);
      } catch (err) {
        console.error("Failed to load template", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplate();
  }, [id]);

  const handlePayment = async () => {
    if (!template) return;
    setIsProcessing(true);
    try {
      // 1. Create unpaid Order
      const orderRes = await api.post('/orders', { 
        templateId: template._id || template.id, 
        quantity: 1
      });
      const order = orderRes.data;

      // 2. Call Stripe Endpoint to create a Checkout Session
      const origin = window.location.origin;
      const stripeRes = await api.post('/stripe/create-checkout-session', {
        orderId: order._id || order.id,
        successUrl: `${origin}/dashboard/marketplace/${id}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/dashboard/marketplace/${id}/payment?cancelled=true`,
      });

      const { url } = stripeRes.data;
      if (url) {
        // Redirect directly to Stripe Secure Checkout
        window.location.href = url;
      } else {
        throw new Error("Stripe checkout URL not returned");
      }
    } catch (err: any) {
      console.error("Stripe payment redirection failed:", err);
      alert(err.response?.data?.message || err.message || "Failed to initiate Stripe Checkout");
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#123E41]"></div>
      </div>
    );
  }

  if (!template) {
    return <div className="text-center p-10">Template not found</div>;
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col h-full overflow-y-auto custom-scrollbar pb-10">
      <div className="border-b-2 border-[#b0c4c4] pb-2 mb-4 relative z-50">
        <UserHeader compact />
      </div>

      {/* Header */}
      <div className="flex items-center mb-8 relative justify-center">
        <Link 
          href={`/dashboard/marketplace/${id}`}
          className="absolute left-0 w-10 h-10 bg-[#123E41] text-white rounded-full flex items-center justify-center hover:bg-[#0d2c2e] transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Payment Checkout</h1>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[500px]"
        >
          {isCancelled && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl mb-6 text-sm flex gap-2.5 items-start">
              <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">Payment Cancelled</p>
                <p className="text-red-600/90 text-xs mt-0.5">Your payment process was cancelled. You have not been charged. You can retry checkout when you are ready.</p>
              </div>
            </div>
          )}
          
          <OrderSummary template={template} />
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 w-full space-y-4">
            <div className="flex items-center gap-3 text-[#103B40] font-semibold">
              <CreditCard className="text-[#123E41]" size={20} />
              <span>Payment Method</span>
            </div>
            
            <div className="bg-[#123E41]/5 rounded-xl p-4 border border-[#123E41]/10 flex gap-3 items-start">
              <Info size={16} className="text-[#123E41] mt-0.5 flex-shrink-0" />
              <div className="text-xs text-[#103B40]/80 space-y-1">
                <p className="font-bold text-[#103B40]">Secure Stripe Checkout</p>
                <p>You will be redirected to Stripe's secure page to complete your payment.</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px] tracking-wider uppercase select-none">
                  Stripe Test Mode Only
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-8">
            <Lock size={12} className="text-gray-400" />
            Your payment information is secure and encrypted
          </div>

          <div className="space-y-3">
             <button 
               onClick={handlePayment} 
               disabled={isProcessing}
               className="w-full bg-[#123E41] text-white font-bold py-3.5 rounded-xl hover:bg-[#0d2c2e] disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex justify-center items-center gap-2 shadow-sm"
             >
               {isProcessing ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                 <Lock size={16} />
               )}
               {isProcessing 
                 ? "Redirecting to Stripe..." 
                 : `Proceed to Stripe Checkout ($${template.price.toFixed(2)})`}
             </button>
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
