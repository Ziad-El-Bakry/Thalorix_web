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
  sellerId?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const isValidImage = (src?: string) => {
  if (!src) return false;
  if (src.startsWith("/mnt/")) return false;
  return true;
};

export default function TemplateCard({ id, title, price, imageSrc, category, seller, sellerId }: TemplateCardProps) {
  const hasValidImage = isValidImage(imageSrc);

  return (
    <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-[20px] overflow-hidden p-4 shadow-xl dark:shadow-gray-900/40 hover:shadow-2xl dark:hover:shadow-gray-900/60 transition-shadow duration-300 flex flex-col h-full border border-transparent dark:border-gray-800 group">
      <div className="relative w-full overflow-hidden mb-4 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        {hasValidImage ? (
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-[1.03]" 
          />
        ) : (
          <div className="w-full aspect-video flex flex-col justify-center items-center text-gray-400 dark:text-gray-500 bg-[#E2E3EA] dark:bg-gray-800 rounded-xl">
            <span className="text-sm font-medium">No Cover</span>
          </div>
        )}
      </div>
      <div className="px-1 mb-4 flex-1 flex flex-col">
        {category && (
          <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">{category}</p>
        )}
        <h3 className="font-bold text-[#103B40] dark:text-white text-[18px] leading-tight mb-2 line-clamp-2">{title}</h3>
        {seller && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-auto mb-3">By {" "}
            {sellerId ? (
              <Link href={`/dashboard/seller/${sellerId}`} className="font-semibold text-gray-700 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-400 hover:underline transition-colors">
                {seller}
              </Link>
            ) : (
              <span className="font-medium text-gray-700 dark:text-gray-300">{seller}</span>
            )}
          </p>
        )}
        
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
          {price <= 0 ? (
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Free</span>
          ) : (
            <p className="font-bold text-[#103B40] dark:text-[#43B0B5] text-[16px]">${price.toFixed(2)}</p>
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