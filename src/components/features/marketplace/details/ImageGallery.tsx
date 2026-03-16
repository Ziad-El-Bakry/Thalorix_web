"use client";

import { motion } from "framer-motion";

export default function ImageGallery() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white rounded-2xl p-4 shadow-sm mb-8"
    >
      <div className="relative w-full aspect-[21/9] bg-gray-100 rounded-xl overflow-hidden mb-4">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
           Main Presentation Image Placeholder
        </div>
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          1/5
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex-shrink-0 w-32 aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden relative">
             <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
               Thumb {item}
             </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
