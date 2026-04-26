"use client";

import { Plus } from "lucide-react";

export default function PaymentMethod() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 mb-6">
      <h2 className="font-bold text-[#103B40] text-lg mb-4">Payment Method</h2>
      
      <div className="space-y-3">
        <label className="flex items-center justify-between border border-[#123E41] rounded-xl p-4 cursor-pointer">
          <div className="flex gap-4 items-center">
            <div className="w-5 h-5 rounded-full border-[6px] border-[#103B40] flex items-center justify-center"></div>
            <div className="flex items-center gap-2">
               <div className="w-8 flex justify-center text-blue-600 font-bold text-xs italic">VISA</div>
               <div>
                 <p className="font-semibold text-sm text-gray-900">•••• 4532</p>
                 <p className="text-[10px] text-gray-500 font-medium">Expires 12/26</p>
               </div>
            </div>
          </div>
        </label>

        <label className="flex items-center justify-between border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#123E41]/50">
          <div className="flex gap-4 items-center">
            <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center"></div>
            <div className="flex items-center gap-2">
               <div className="w-8 flex justify-center text-amber-500 font-bold text-xs">
                  {/* Mock mastercard logo */}
                  <div className="flex items-center relative w-6 h-4">
                     <div className="w-3.5 h-3.5 rounded-full bg-red-500 opacity-80 absolute left-0 mix-blend-multiply"></div>
                     <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 opacity-80 absolute left-2 mix-blend-multiply"></div>
                  </div>
               </div>
               <div>
                 <p className="font-semibold text-sm text-gray-900">•••• 8901</p>
                 <p className="text-[10px] text-gray-500 font-medium">Expires 08/25</p>
               </div>
            </div>
          </div>
        </label>

        <button className="w-full border border-dashed border-gray-300 rounded-xl p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
           <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-400">
              <Plus size={14} />
           </div>
           <span className="font-semibold text-sm text-gray-900">Add New Card</span>
        </button>
      </div>
    </div>
  );
}
