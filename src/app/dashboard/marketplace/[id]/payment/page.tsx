"use client";

import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";
import UserHeader from "@/components/ui/UserHeader";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import OrderSummary from "@/components/features/marketplace/payment/OrderSummary";
import PaymentMethod from "@/components/features/marketplace/payment/PaymentMethod";
import { useState, useEffect } from "react";
import { Template } from "@/types";
import { templatesService } from "@/lib/api/services/templates.service";
import { api } from "@/lib/api/axios";
import { useAuthStore } from "@/store/useAuthStore";

export default function PaymentPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id || "1");
  const { user } = useAuthStore();
  
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
      // 1. Create Order
      const orderRes = await api.post('/orders', { templateId: template._id || template.id, quantity: 1 });
      const order = orderRes.data;

      // 2. Create Stripe Checkout Session
      const successUrl = `${window.location.origin}/dashboard/marketplace/${id}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
      
      const stripeRes = await api.post('/stripe/create-checkout-session', {
        items: [{
          name: template.title,
          amount: Math.round(template.price * 100), // convert to cents
          quantity: 1,
          images: template.image || template.imageUrl
        }],
        customerEmail: user?.email,
        orderId: order._id,
        successUrl
      });

      // 3. Redirect to Stripe
      if (stripeRes.data.url) {
        window.location.href = stripeRes.data.url;
      }
    } catch (err: any) {
      console.error("Payment setup failed:", err);
      alert(err.response?.data?.message || "Failed to initiate payment");
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
        <h1 className="text-xl font-bold text-gray-900">Payment</h1>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[500px]"
        >
          
          <OrderSummary template={template} />
          <PaymentMethod />

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
               {isProcessing ? "Processing..." : `Confirm & pay $${template.price.toFixed(2)}`}
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
