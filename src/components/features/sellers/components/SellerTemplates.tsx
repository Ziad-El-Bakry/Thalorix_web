"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface SellerTemplatesProps {
  templates: any[];
}

export default function SellerTemplates({ templates }: SellerTemplatesProps) {
  const router = useRouter();

  if (templates.length === 0) {
    return (
      <div className="bg-white py-16 text-center rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mx-auto mb-4">
          <ShoppingBag size={24} />
        </div>
        <h4 className="text-lg font-bold text-gray-900 mb-1">No Templates Available</h4>
        <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
          This seller hasn't posted any templates or files for download yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {templates.map((tpl) => (
        <motion.div
          key={tpl._id || tpl.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl overflow-hidden p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
        >
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-slate-50 border border-slate-100">
            {tpl.image ? (
              <img src={tpl.image} alt={tpl.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex justify-center items-center text-gray-400 bg-slate-100 text-xs">
                No Template Preview
              </div>
            )}
            <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#103B40] shadow-sm">
              {tpl.price <= 0 ? "Free" : `$${tpl.price}`}
            </span>
          </div>
          <div className="mb-4">
            <h4 className="font-extrabold text-[#103B40] text-[16px] truncate mb-1">{tpl.title}</h4>
            <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed min-h-[32px]">
              {tpl.description}
            </p>
          </div>
          <button
            onClick={() => router.push(`/dashboard/marketplace/${tpl._id || tpl.id}`)}
            className="w-full bg-[#123E41] text-white py-3 rounded-xl hover:bg-[#0d2c2e] transition-colors font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Eye size={14} />
            View Details
          </button>
        </motion.div>
      ))}
    </div>
  );
}
