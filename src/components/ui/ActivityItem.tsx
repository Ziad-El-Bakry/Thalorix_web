"use client";

import { motion } from "framer-motion";

interface ActivityItemProps {
  icon: string;
  iconBg: string;
  title: string;
  subtitle: string;
  status: string;
  statusColor: string;
  onClick?: () => void;
}

export default function ActivityItem({
  icon,
  iconBg,
  title,
  subtitle,
  status,
  statusColor,
  onClick,
}: ActivityItemProps) {
  return (
    <motion.div
        onClick={onClick}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ backgroundColor: "#FCFDFE" }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 md:gap-4 py-3 md:py-3.5 border-b border-[#F0F1F7] cursor-pointer"
      >
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center justify-center shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-lg text-base md:text-lg"
          style={{ background: iconBg }}
        >
          {icon}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm md:text-[14px] font-semibold text-[#103B40] mb-0.5 md:mb-1 truncate">
            {title}
          </p>
          <p className="text-xs md:text-[12px] text-gray-500 truncate">
            {subtitle}
          </p>
        </div>

        {/* Status Badge */}
        <motion.span
          whileHover={{ scale: 0.05 }}
          className="text-[10px] md:text-xs font-semibold px-2 py-1 md:px-3 rounded-md whitespace-nowrap"
          style={{
            color: statusColor,
            background: `${statusColor}15`,
          }}
        >
          {status}
        </motion.span>

        {/* Arrow */}
        <motion.span
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-[#103B40] text-xl md:text-2xl"
        >
          ›
        </motion.span>
      </motion.div>
  );
}