"use client";

import React from "react";
import { MapPin, Calendar, CheckCircle, Edit2, Plus, MessageSquare, Share2 } from "lucide-react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

interface SellerHeaderProps {
  seller: any;
  isOwnProfile: boolean;
  isFollowing: boolean;
  followersCount: number;
  onFollowToggle: () => void;
  onMessageClick: () => void;
  onShareClick: () => void;
}

export default function SellerHeader({
  seller,
  isOwnProfile,
  isFollowing,
  followersCount,
  onFollowToggle,
  onMessageClick,
  onShareClick,
}: SellerHeaderProps) {
  const router = useRouter();

  return (
    <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl mb-6 border border-gray-100">
      {/* Cover Banner */}
      <div className="h-64 sm:h-80 w-full relative bg-gradient-to-r from-teal-800 to-cyan-900 overflow-hidden">
        {seller.banner ? (
          <img src={seller.banner} alt={seller.storeName || seller.name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-600 via-emerald-950 to-slate-900 opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Brand row */}
      <div className="px-6 sm:px-8 pb-8 relative">
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
          {/* Store Logo */}
          <div className="-mt-16 sm:-mt-20 w-32 h-32 sm:w-44 sm:h-44 rounded-full border-4 border-white bg-slate-50 overflow-hidden shadow-xl relative z-10 flex-shrink-0 flex items-center justify-center mx-auto md:mx-0">
            {seller.logo ? (
              <img src={seller.logo} alt={seller.storeName || seller.name} className="w-full h-full object-cover" />
            ) : (
              <div className="bg-gradient-to-tr from-teal-600 to-cyan-500 w-full h-full flex items-center justify-center text-white text-4xl font-bold font-serif shadow-inner">
                {(seller.storeName || seller.name || "S")[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Store Name & Location Info */}
          <div className="flex-1 min-w-0 text-center md:text-left pt-2 md:pb-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight break-words line-clamp-2">
                {seller.storeName || seller.name || "Store Name"}
              </h1>
              {seller.isVerified && (
                <div className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 px-3 py-0.5 rounded-full text-xs font-bold border border-teal-100 shadow-sm flex-shrink-0">
                  <CheckCircle size={12} className="fill-teal-600 text-white" />
                  <span>Verified Creator</span>
                </div>
              )}
            </div>

            <p className="text-gray-500 font-medium text-sm mb-3 truncate">
              Owned by <span className="text-gray-700 font-semibold">{seller.name}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 text-xs font-medium text-gray-600">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <MapPin size={14} className="text-teal-600" />
                <span className="truncate max-w-[150px] sm:max-w-none">{seller.address || "Global Presence"}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Calendar size={14} className="text-teal-600" />
                <span>Joined {dayjs(seller.createdAt).format("MMMM YYYY")}</span>
              </div>
              {seller.businessCategory && (
                <div className="bg-teal-50/50 border border-teal-100 px-2.5 py-0.5 rounded text-teal-700 font-bold uppercase tracking-wider text-[10px] flex-shrink-0">
                  {seller.businessCategory}
                </div>
              )}
            </div>
          </div>

          {/* Actions panel */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 mt-2 md:mt-0 md:pb-2 relative z-10 w-full md:w-auto">
            {isOwnProfile ? (
              <button
                onClick={() => router.push("/dashboard/seller/settings")}
                className="flex items-center gap-2 bg-[#123E41] hover:bg-[#0d2c2e] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg active:scale-95 w-full sm:w-auto justify-center"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={onFollowToggle}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md active:scale-95 w-full sm:w-auto justify-center ${
                    isFollowing
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                      : "bg-[#123E41] hover:bg-[#0d2c2e] text-white"
                  }`}
                >
                  <Plus size={16} className={isFollowing ? "rotate-45 transition-transform" : ""} />
                  {isFollowing ? "Unfollow Store" : "Follow Store"}
                </button>
                <button
                  onClick={onMessageClick}
                  className="flex items-center gap-2 bg-teal-50 text-[#123E41] border border-teal-100 hover:bg-teal-100/50 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md active:scale-95 w-full sm:w-auto justify-center"
                >
                  <MessageSquare size={16} />
                  Message
                </button>
              </>
            )}
            <button
              onClick={onShareClick}
              className="flex items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors w-[42px] h-[42px] active:scale-95 flex-shrink-0"
              title="Share Profile"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
