"use client";

import React from "react";
import { Mail, Globe, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

interface SellerAboutProps {
  seller: any;
}

export default function SellerAbout({ seller }: SellerAboutProps) {
  return (
    <div className="space-y-6">
      {/* About store widget */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-100">About Store</h3>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
          {seller.storeDescription || seller.bio || "This seller hasn't written a description for their store yet."}
        </p>

        <div className="pt-2 space-y-4">
          {seller.email && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 shrink-0">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Email</p>
                <a href={`mailto:${seller.email}`} className="text-sm font-semibold text-gray-800 hover:text-teal-700">
                  {seller.email}
                </a>
              </div>
            </div>
          )}

          {seller.website && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 shrink-0">
                <Globe size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Website</p>
                <a href={seller.website.startsWith("http") ? seller.website : `https://${seller.website}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-teal-700 hover:underline">
                  {seller.website}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Social connections */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-100 mb-4">Connect</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { link: seller.socialLinks?.facebook, icon: Facebook, color: "hover:bg-blue-50 hover:text-blue-600" },
            { link: seller.socialLinks?.instagram, icon: Instagram, color: "hover:bg-pink-50 hover:text-pink-600" },
            { link: seller.socialLinks?.linkedin, icon: Linkedin, color: "hover:bg-sky-50 hover:text-sky-600" },
            { link: seller.socialLinks?.twitter, icon: Twitter, color: "hover:bg-slate-100 hover:text-slate-900" },
          ].map((social, index) => {
            const Icon = social.icon;
            if (!social.link) return null;
            return (
              <a
                key={index}
                href={social.link.startsWith("http") ? social.link : `https://${social.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200/60 text-slate-500 transition-all active:scale-95 ${social.color}`}
              >
                <Icon size={18} />
              </a>
            );
          })}
          {!seller.socialLinks?.facebook && !seller.socialLinks?.instagram && !seller.socialLinks?.linkedin && !seller.socialLinks?.twitter && (
            <p className="text-gray-400 text-xs italic">No social media links connected.</p>
          )}
        </div>
      </div>
    </div>
  );
}
