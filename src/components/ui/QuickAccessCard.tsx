"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  badge?: string;
  color?: string;
}

export default function QuickAccessCard({
  title,
  description,
  icon,
  href,
  badge,
  color = "#103B40",
}: QuickAccessCardProps) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col relative cursor-pointer gap-3 min-h-[140px] md:min-h-[150px] p-5 md:p-7 rounded-[15px]"
        style={{ background: color }}
      >
        {badge && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:py-1 rounded-full">
            {badge}
          </span>
        )}

        <motion.div
          whileHover={{ rotate: 10 }}
          className="flex items-center justify-center text-lg md:text-xl w-10 h-10 md:w-[42px] md:h-[42px] rounded-lg"
        >
          {icon}
        </motion.div>

        <div>
          <h3 className="text-white text-sm sm:text-base font-bold mb-1">
            {title}
          </h3>
          <p className="text-white/70 text-xs sm:text-[13px] leading-relaxed">
            {description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}