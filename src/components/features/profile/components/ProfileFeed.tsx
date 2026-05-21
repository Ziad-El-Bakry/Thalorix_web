import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Star } from "lucide-react";
import CreatePostBar from "@/components/features/community/CreatePostBar";
import PostCard from "@/components/features/community/PostCard";

interface ProfileFeedProps {
  isOwnProfile: boolean;
  userName: string;
  activeProfileTab: "posts" | "projects" | "media";
  setActiveProfileTab: (tab: "posts" | "projects" | "media") => void;
  posts: any[];
}

export default function ProfileFeed({
  isOwnProfile,
  userName,
  activeProfileTab,
  setActiveProfileTab,
  posts,
}: ProfileFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="flex-1 min-w-0 space-y-4"
    >
      {/* Create Post Bar */}
      {isOwnProfile && <CreatePostBar userName={userName} />}

      {/* Profile tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-3 flex items-center gap-1">
        {(["posts", "projects", "media"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveProfileTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200 ${
              activeProfileTab === tab
                ? "bg-[#103B40] text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Posts feed */}
      <div className="space-y-4">
        {activeProfileTab === "posts" &&
          posts.map((post: any, idx: number) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx, duration: 0.35 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        {activeProfileTab === "projects" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center">
            <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm font-medium">No projects yet</p>
            <p className="text-gray-300 text-xs mt-1">Share your projects to showcase your work</p>
          </div>
        )}
        {activeProfileTab === "media" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center">
            <Star size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm font-medium">No media yet</p>
            <p className="text-gray-300 text-xs mt-1">Photos and videos you share will appear here</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
