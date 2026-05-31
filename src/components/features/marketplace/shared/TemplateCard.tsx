"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface TemplateCardProps {
  id: string;
  title: string;
  price: number;
  imageSrc?: string;
  category?: string;
  seller?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function TemplateCard({ id, title, price, imageSrc, category, seller }: TemplateCardProps) {
  return (
    <motion.div variants={itemVariants} className="bg-white rounded-[20px] overflow-hidden p-4 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full">
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-gray-100">
        {imageSrc ? (
          <Image src={imageSrc} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center text-gray-400 bg-[#E2E3EA]">
            <span className="text-sm font-medium">No Cover</span>
          </div>
        )}
      </div>
      <div className="px-1 mb-4 flex-1 flex flex-col">
        {category && (
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">{category}</p>
        )}
        <h3 className="font-bold text-[#103B40] text-[18px] leading-tight mb-2 line-clamp-2">{title}</h3>
        {seller && (
          <p className="text-xs text-gray-500 mt-auto mb-3">By <span className="font-medium text-gray-700">{seller}</span></p>
        )}
        
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-100">
          {price <= 0 ? (
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Free</span>
          ) : (
            <p className="font-bold text-[#103B40] text-[16px]">${price.toFixed(2)}</p>
          )}
        </div>
      </div>
      <Link href={`/dashboard/marketplace/${id}`} className="block w-full mt-auto">
        <button className="w-full bg-[#123E41] text-white py-3 rounded-xl hover:bg-[#0d2c2e] transition-colors font-medium text-sm">
          View Template
        </button>
      </Link>
    </motion.div>
  );
}