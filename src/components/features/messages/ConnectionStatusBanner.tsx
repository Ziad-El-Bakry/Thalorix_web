"use client";

import React, { useEffect, useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { WifiOff, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConnectionStatusBanner() {
  const { socketConnected } = useChatStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show banner if disconnected after initial delay, to avoid flashing
    if (!socketConnected) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [socketConnected]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium backdrop-blur-sm"
        >
          <WifiOff className="w-4 h-4 text-red-400" />
          <span>Connecting...</span>
          <RefreshCcw className="w-3.5 h-3.5 animate-spin text-gray-400 ml-1" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
