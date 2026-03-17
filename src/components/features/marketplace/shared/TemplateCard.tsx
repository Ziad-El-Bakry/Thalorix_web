"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface TemplateCardProps {
  id: string | number;
  title: string;
  price: number;
  imageSrc: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function TemplateCard({ id, title, price, imageSrc }: TemplateCardProps) {
  return (
    <motion.div variants={itemVariants} className="bg-white rounded-[20px] overflow-hidden p-4 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-gray-100">
        {imageSrc ? (
          <Image src={imageSrc} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex justify-center items-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="px-1 mb-4">
        <h3 className="font-semibold text-[#103B40] text-[18px]">{title}</h3>
        <p className="font-bold text-[#103B40] text-[16px]">${price}</p>
      </div>
      <Link href={`/dashboard/marketplace/${id}`} className="block w-full">
        <button className="w-full bg-[#123E41] text-white py-3 rounded-xl hover:bg-[#0d2c2e] transition-colors font-medium">
          View Template
        </button>
      </Link>
    </motion.div>
  );
}