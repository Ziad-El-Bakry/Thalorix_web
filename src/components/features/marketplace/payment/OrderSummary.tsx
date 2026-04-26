"use client";

import { Layers } from "lucide-react";

export default function OrderSummary() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 mb-6">
      <h2 className="font-bold text-[#103B40] text-lg mb-4">Order Summary</h2>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 flex-shrink-0">
          <Layers className="text-[#103B40]" size={24} />
        </div>
        <div>
          <p className="font-semibold text-gray-900 leading-tight">Modern Dashboard Template</p>
          <p className="text-xs text-gray-500 mt-1">Premium UI & Components</p>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm font-semibold text-[#103B40]">
          <span>Template Price</span>
          <span>$49.00</span>
        </div>
        <div className="flex justify-between items-center text-sm font-semibold text-[#103B40]">
          <span>Tax (VAT 20%)</span>
          <span>$9.00</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="font-bold text-gray-900 text-lg">Total</span>
        <span className="font-bold text-[#103B40] text-xl">$58.80</span>
      </div>
    </div>
  );
}
