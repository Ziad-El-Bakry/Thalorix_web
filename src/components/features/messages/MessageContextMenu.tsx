"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reply, CheckSquare, Trash2 } from "lucide-react";

interface MessageContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onReply: () => void;
  onSelect: () => void;
  onDelete?: () => void;
  isOwn: boolean;
}

export default function MessageContextMenu({
  x,
  y,
  onClose,
  onReply,
  onSelect,
  onDelete,
  isOwn,
}: MessageContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Use capturing phase to ensure it runs before other click handlers might stop propagation
    document.addEventListener("mousedown", handleClickOutside, true);
    // Also close on scroll or window resize
    window.addEventListener("scroll", onClose, true);
    window.addEventListener("resize", onClose);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      window.removeEventListener("scroll", onClose, true);
      window.removeEventListener("resize", onClose);
    };
  }, [onClose]);

  // Adjust position to ensure it stays within the viewport
  const displayX = Math.min(x, typeof window !== "undefined" ? window.innerWidth - 180 : x);
  const displayY = Math.min(y, typeof window !== "undefined" ? window.innerHeight - 150 : y);

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        style={{ top: displayY, left: displayX }}
        className="fixed z-[100] w-44 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden py-1"
        // Prevent clicks inside the menu from propagating up and immediately closing it
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            onReply();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Reply size={16} className="text-gray-500" />
          <span className="font-medium">Reply</span>
        </button>
        
        <button
          onClick={() => {
            onSelect();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <CheckSquare size={16} className="text-gray-500" />
          <span className="font-medium">Select</span>
        </button>

        {isOwn && (
          <>
            <div className="h-px bg-gray-100 my-1 mx-2" />
            <button
              onClick={() => {
                onDelete?.();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} />
              <span className="font-medium">Delete</span>
            </button>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
