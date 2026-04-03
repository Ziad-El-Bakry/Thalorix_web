"use client";

import { useState } from "react";
import Image from "next/image";
import { Video, ImageIcon, FileText } from "lucide-react";
import { motion } from "framer-motion";
import CreatePostModal from "./CreatePostModal";

interface CreatePostBarProps {
  userName?: string;
  userAvatar?: string;
}

export default function CreatePostBar({ userName = "User", userAvatar }: CreatePostBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<"text" | "video" | "photo" | "article">("text");

  const avatarSrc = userAvatar || "/images/avatar.png";

  const openModal = (tab: "text" | "video" | "photo" | "article") => {
    setInitialTab(tab);
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 pt-5 pb-3"
      >
        {/* Top row: Avatar + Input */}
        <div className="flex items-center gap-4">
          <Image
            src={avatarSrc}
            alt={userName}
            width={56}
            height={56}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow-sm"
          />
          <button
            onClick={() => openModal("text")}
            className="flex-1 text-left px-5 py-3 rounded-full border border-gray-400 text-gray-500 text-[15px] font-medium hover:bg-gray-100 hover:border-gray-500 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          >
            Start a post
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200/70 my-3" />

        {/* Action buttons row */}
        <div className="flex items-center justify-around">
          <motion.button
            whileHover={{ backgroundColor: "rgba(0,0,0,0.04)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openModal("video")}
            className="flex items-center gap-2.5 px-5 py-3 rounded-lg text-[14px] font-semibold text-gray-600 transition-colors duration-200 cursor-pointer"
          >
            <Video size={24} className="text-red-500" strokeWidth={2.2} />
            Video
          </motion.button>

          <motion.button
            whileHover={{ backgroundColor: "rgba(0,0,0,0.04)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openModal("photo")}
            className="flex items-center gap-2.5 px-5 py-3 rounded-lg text-[14px] font-semibold text-gray-600 transition-colors duration-200 cursor-pointer"
          >
            <ImageIcon size={24} className="text-blue-500" strokeWidth={2.2} />
            Photo
          </motion.button>

          <motion.button
            whileHover={{ backgroundColor: "rgba(0,0,0,0.04)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openModal("article")}
            className="flex items-center gap-2.5 px-5 py-3 rounded-lg text-[14px] font-semibold text-gray-600 transition-colors duration-200 cursor-pointer"
          >
            <FileText size={24} className="text-orange-500" strokeWidth={2.2} />
            Write article
          </motion.button>
        </div>
      </motion.div>

      {/* Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab={initialTab}
        userName={userName}
        userAvatar={avatarSrc}
      />
    </>
  );
}
