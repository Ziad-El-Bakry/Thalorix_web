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
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 0",
        borderBottom: "1px solid #F0F1F7",
        cursor: "pointer",
      }}
    >
      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{
          width: 44,
          height: 44,
          background: iconBg,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {icon}
      </motion.div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#103B40",
            marginBottom: 2,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: 12,
            color: "#6b7280",
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Status Badge */}
      <motion.span
        whileHover={{ scale: 0.05 }}
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: statusColor,
          background: `${statusColor}15`,
          padding: "4px 12px",
          borderRadius: 6,
          whiteSpace: "nowrap",
        }}
      >
        {status}
      </motion.span>

      {/* Arrow */}
      <motion.span
        initial={{ x: 0 }}
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{ color: "#103B40", fontSize: 25 }}
      >
        ›
      </motion.span>
    </motion.div>
  );
}