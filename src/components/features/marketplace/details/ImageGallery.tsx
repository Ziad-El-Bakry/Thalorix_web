"use client";

import { motion } from "framer-motion";
import { Template } from "@/types";
import Image from "next/image";

interface ImageGalleryProps {
  template: Template;
}

export default function ImageGallery({ template }: ImageGalleryProps) {
  const mainImage = template.image || template.imageUrl;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white rounded-2xl p-4 shadow-sm mb-8"
    >
      <div className="relative w-full aspect-[21/9] bg-[#E2E3EA] rounded-xl overflow-hidden mb-4">
        {mainImage ? (
          <Image src={mainImage} alt={template.title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
             <span className="font-medium text-lg">No Presentation Image</span>
             <span className="text-sm">The seller did not upload an image</span>
          </div>
        )}
      </div>
      {/* We are removing the mock thumbnail bar since backend only has 1 image */}
    </motion.div>
  );
}
