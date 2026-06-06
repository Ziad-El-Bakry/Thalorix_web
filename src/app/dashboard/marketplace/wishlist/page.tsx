"use client";

import { Suspense } from "react";
import { Search, Heart, ShoppingCart, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Mock data for wishlist
const WISHLIST_ITEMS = [
  { id: "1", title: "Pro Dashboard UI Kit", author: "Sophia Smith", price: 29, image: null, rating: 4.8 },
  { id: "2", title: "React Component Library", author: "Liam Johnson", price: 49, image: null, rating: 5.0 },
  { id: "3", title: "E-Commerce App Template", author: "Emma Williams", price: 39, image: null, rating: 4.5 },
];

export default function WishlistPage() {
  return (
    <div className="w-full max-w-[1200px] mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-sm text-gray-500 mt-1">Save templates you love and buy them later</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {WISHLIST_ITEMS.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
              <Heart size={32} className="text-rose-400 fill-rose-200/50" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Browse the marketplace and click the heart icon to save templates you're interested in purchasing later.
            </p>
            <Link href="/dashboard/marketplace">
              <button className="px-8 py-3 bg-[#103B40] text-white rounded-xl font-bold hover:bg-[#0d2c2e] transition-colors shadow-sm flex items-center justify-center gap-2">
                <ShoppingBag size={18} /> Browse Marketplace
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
             {WISHLIST_ITEMS.map((item, index) => (
                <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                    <button aria-label="Remove from wishlist" title="Remove from wishlist" className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-colors group/btn">
                        <X size={16} />
                    </button>
                    
                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-500">
                            <ShoppingBag size={48} />
                        </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                ★ {item.rating.toFixed(1)}
                            </span>
                            <span className="text-lg font-bold text-[#103B40]">${item.price}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#43B0B5] transition-colors">{item.title}</h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-1">by {item.author}</p>
                        
                        <div className="mt-auto pt-4 flex gap-2">
                            <button className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-[#103B40] rounded-xl font-bold text-sm transition-colors">
                                View Details
                            </button>
                            <button className="flex-1 py-2.5 bg-[#43B0B5] hover:bg-[#389b9f] text-white rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2">
                                <ShoppingCart size={16} /> Add
                            </button>
                        </div>
                    </div>
                </motion.div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
