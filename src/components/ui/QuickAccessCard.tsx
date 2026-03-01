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
        style={{
          background: color,
          borderRadius: 15,
          padding: "28px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          position: "relative",
          cursor: "pointer",
          minHeight: 150,
        }}
      >
        {badge && (
          <span
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "#ef4444",
              color: "white",
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 999,
            }}
          >
            {badge}
          </span>
        )}

        <motion.div
          whileHover={{ rotate: 10 }}
          style={{
            width: 42,
            height: 42,
            //background: "rgba(255,255,255,0.15)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          {icon}
        </motion.div>

        <div>
          <h3
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            {title}
          </h3>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 13,
              lineHeight: 1.4,
            }}
          >
            {description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}