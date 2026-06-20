"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface AdminStatCardProps {
  icon: ReactNode;
  iconBg: string;
  value: number;
  prefix?: string;
  label: string;
  subtitle: string;
  live?: boolean;
}

function useAnimatedCounter(end: number, duration: number = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let frame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, duration]);

  return count;
}

export default function AdminStatCard({
  icon,
  iconBg,
  value,
  prefix = "",
  label,
  subtitle,
  live = true,
}: AdminStatCardProps) {
  const animatedValue = useAnimatedCounter(value);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-[0.04]"
        style={{ backgroundColor: iconBg, transform: "translate(30%, -30%)" }}
      />

      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: iconBg + "18" }}
        >
          {icon}
        </div>
        {live && (
          <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-emerald-600 tracking-wide">LIVE</span>
          </div>
        )}
      </div>

      <h3 className="text-3xl font-bold text-gray-900 mb-0.5">
        {prefix}{animatedValue.toLocaleString()}
      </h3>
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
    </motion.div>
  );
}
