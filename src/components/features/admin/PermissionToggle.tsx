"use client";

import { motion } from "framer-motion";

interface PermissionToggleProps {
  enabled: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
}

export default function PermissionToggle({ enabled, onToggle, size = "sm" }: PermissionToggleProps) {
  const w = size === "sm" ? 36 : 44;
  const h = size === "sm" ? 20 : 24;
  const knob = size === "sm" ? 16 : 20;
  const pad = 2;

  return (
    <button
      onClick={onToggle}
      className="relative rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#103B40] flex-shrink-0"
      style={{
        width: w,
        height: h,
        backgroundColor: enabled ? "#103B40" : "#d1d5db",
      }}
      aria-label={enabled ? "Disable permission" : "Enable permission"}
      role="switch"
      aria-checked={enabled}
    >
      <motion.div
        className="absolute rounded-full bg-white shadow-sm"
        style={{ width: knob, height: knob, top: pad }}
        animate={{ left: enabled ? w - knob - pad : pad }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
