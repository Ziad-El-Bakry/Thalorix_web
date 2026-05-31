"use client";

import { Layers } from "lucide-react";
import { Template } from "@/types";

interface OrderSummaryProps {
  template: Template;
}

export default function OrderSummary({ template }: OrderSummaryProps) {
  // Let's assume no tax for now to match exactly what is sent to Stripe (or we could add tax)
  const price = template.price || 0;
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 mb-6">
      <h2 className="font-bold text-[#103B40] text-lg mb-4">Order Summary</h2>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 flex-shrink-0 overflow-hidden">
          {template.image || template.imageUrl ? (
            <img src={template.image || template.imageUrl} alt={template.title} className="w-full h-full object-cover" />
          ) : (
            <Layers className="text-[#103B40]" size={24} />
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-900 leading-tight">{template.title}</p>
          <p className="text-xs text-gray-500 mt-1">{(template as any).categoryId?.name || "Template"}</p>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm font-semibold text-[#103B40]">
          <span>Template Price</span>
          <span>${price.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="font-bold text-gray-900 text-lg">Total</span>
        <span className="font-bold text-[#103B40] text-xl">${price.toFixed(2)}</span>
      </div>
    </div>
  );
}
