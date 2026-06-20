"use client";

import { Star, Download, Check, User } from "lucide-react";
import { Template } from "@/types";
import Link from "next/link";
import { authService } from "@/lib/api/services/auth.service";
import { useEffect, useState } from "react";

interface TemplateInfoProps {
  template: Template;
}

export default function TemplateInfo({ template }: TemplateInfoProps) {
  const seller = (template as any).developerId || (template as any).sellerId;
  const sellerName = seller?.name || "Unknown Seller";
  const sellerId = seller?._id || seller?.id;
  const sellerAvatar = seller?.avatarUrl || seller?.avatar || seller?.logo || "";

  const [profileUrl, setProfileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (sellerId) {
      const user = authService.getStoredUser() as any;
      if (user && (user._id === sellerId || user.id === sellerId)) {
        setProfileUrl("/dashboard/profile");
      } else {
        setProfileUrl(`/dashboard/seller/${sellerId}`);
      }
    }
  }, [sellerId]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#103B40] dark:text-white mb-2">{template.title}</h2>
        
        {/* We removed mock ratings/downloads per instructions */}

        <div className="flex items-center gap-3 mt-6 mb-6">
          {profileUrl ? (
            <Link href={profileUrl} className="flex items-center gap-3 hover:opacity-85 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100 dark:border-gray-600 shadow-sm">
                {sellerAvatar ? (
                  <img
                    src={sellerAvatar}
                    alt={sellerName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="text-gray-400" size={20} />
                )}
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight hover:text-teal-700 dark:hover:text-teal-400 transition-colors">{sellerName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Seller</p>
              </div>
            </Link>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                 <User className="text-gray-400" size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">{sellerName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Seller</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Description</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
          {template.description}
        </p>
      </div>

      {/* Removed Mock 'What's Included' section */}
    </div>
  );
}
