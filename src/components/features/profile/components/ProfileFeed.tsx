import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, Star, Users, Image as ImageIcon, FileText, MessageSquare } from "lucide-react";
import CreatePostBar from "@/components/features/community/CreatePostBar";
import PostCard from "@/components/features/community/PostCard";

interface ProfileFeedProps {
  isOwnProfile: boolean;
  userName: string;
  activeProfileTab: "posts" | "projects" | "media" | "friends";
  setActiveProfileTab: (tab: "posts" | "projects" | "media" | "friends") => void;
  posts: any[];
}

// Beautiful mock friends list matching our design
const MOCK_FRIENDS = [
  { id: "1", name: "Adel Ghamri", title: "Full-Stack Developer", avatar: "/images/profile1.png" },
  { id: "2", name: "Sara Al-Otaibi", title: "UI/UX Designer", avatar: "/images/profile2.png" },
  { id: "user_emad", name: "Emad", title: "Cloud Solutions Architect", avatar: "/images/avatar.png" },
  { id: "user_mona", name: "Mona Hassan", title: "Product Manager", avatar: "/images/avatar.png" },
];

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

      {/* Profile tabs with icons next to each other */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-3 flex items-center gap-1.5 overflow-x-auto">
        {[
          { id: "posts", label: "Posts", icon: FileText },
          { id: "projects", label: "Projects", icon: Briefcase },
          { id: "media", label: "Media", icon: ImageIcon },
          { id: "friends", label: "Friends", icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeProfileTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveProfileTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold capitalize transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "bg-[#103B40] text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feed Contents */}
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
        
        {/* Responsive, modern Friends list grid */}
        {activeProfileTab === "friends" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_FRIENDS.map((friend) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <Link href={friend.id === "1" || friend.id === "2" ? `/dashboard/profile/${friend.id}` : "/dashboard/profile"} className="relative shrink-0 block">
                  <Image
                    src={friend.avatar || "/images/avatar.png"}
                    alt={friend.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover group-hover:ring-2 ring-teal-500/50 transition-all border border-gray-100"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={friend.id === "1" || friend.id === "2" ? `/dashboard/profile/${friend.id}` : "/dashboard/profile"}>
                    <h4 className="text-sm font-bold text-gray-900 truncate hover:text-teal-700 transition-colors leading-snug">
                      {friend.name}
                    </h4>
                  </Link>
                  <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">{friend.title}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link href={`/dashboard/messages?user=${friend.id}`}>
                    <button className="p-2 rounded-full bg-gray-50 hover:bg-teal-50 text-gray-500 hover:text-[#103B40] border border-gray-100 transition-colors" title="Message">
                      <MessageSquare size={15} />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
