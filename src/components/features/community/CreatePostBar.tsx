"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Video, ImageIcon, FileText } from "lucide-react";
import { motion } from "framer-motion";
import CreatePostModal from "./CreatePostModal";
import { useAvatar } from "@/store/useAvatarStore";
import { usePostStore } from "@/store/usePostStore";
import { PostData } from "@/components/features/community/PostCard";

interface CreatePostBarProps {
  userName?: string;
  userAvatar?: string;
}

export default function CreatePostBar({ userName = "User", userAvatar }: CreatePostBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<"text" | "video" | "photo" | "article">("text");
  const { avatar: globalAvatar } = useAvatar();

  const avatarSrc = userAvatar || globalAvatar || "/images/avatar.png";

  const searchParams = useSearchParams();

  const openModal = (tab: "text" | "video" | "photo" | "article") => {
    setInitialTab(tab);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (searchParams && searchParams.get("post") === "new") {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const addPost = usePostStore((state: any) => state.addPost);

  const handlePost = (postData: {
    content: string;
    media?: File[];
    visibility: string;
  }) => {
    // In a real app, media would be uploaded first and we'd get URLs back
    // Here we'll just mock it or handle the text
    const newPost: PostData = {
      id: Date.now().toString(),
      author: {
        id: "1", // Mock ID
        name: userName,
        avatar: avatarSrc,
        title: "User", // Mock title
      },
      content: postData.content,
      // Create a local URL for the first media file if it's an image
      image: postData.media && postData.media.length > 0 && postData.media[0].type.startsWith("image/")
        ? URL.createObjectURL(postData.media[0])
        : undefined,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      shares: 0,
    };
    addPost(newPost);
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
            className="flex items-center gap-1.5 px-2 py-3 rounded-lg text-xs font-semibold text-gray-600 transition-colors duration-200 cursor-pointer whitespace-nowrap"
          >
            <Video size={20} className="text-red-500" strokeWidth={2.2} />
            Video
          </motion.button>

          <motion.button
            whileHover={{ backgroundColor: "rgba(0,0,0,0.04)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openModal("photo")}
            className="flex items-center gap-1.5 px-2 py-3 rounded-lg text-xs font-semibold text-gray-600 transition-colors duration-200 cursor-pointer whitespace-nowrap"
          >
            <ImageIcon size={20} className="text-blue-500" strokeWidth={2.2} />
            Photo
          </motion.button>

          <motion.button
            whileHover={{ backgroundColor: "rgba(0,0,0,0.04)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openModal("article")}
            className="flex items-center gap-1.5 px-2 py-3 rounded-lg text-xs font-semibold text-gray-600 transition-colors duration-200 cursor-pointer whitespace-nowrap"
          >
            <FileText size={20} className="text-orange-500" strokeWidth={2.2} />
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
        onPost={handlePost}
      />
    </>
  );
}
