"use client";

import { Star, Download, Check, User } from "lucide-react";
import { Template } from "@/types";

interface TemplateInfoProps {
  template: Template;
}

export default function TemplateInfo({ template }: TemplateInfoProps) {
  const sellerName = (template as any).sellerId?.name || "Unknown Seller";
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#103B40] mb-2">{template.title}</h2>
        
        {/* We removed mock ratings/downloads per instructions */}

        <div className="flex items-center gap-3 mt-6 mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
             <User className="text-gray-400" size={20} />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900 leading-tight">{sellerName}</p>
            <p className="text-xs text-gray-500">Seller</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg text-gray-900 mb-3">Description</h3>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
          {template.description}
        </p>
      </div>

      {/* Removed Mock 'What's Included' section */}
    </div>
  );
}
