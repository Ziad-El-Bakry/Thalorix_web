import React, { useEffect, useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, Star, Users, Image as ImageIcon, FileText, MessageSquare, ArrowRight, UserCheck, UserPlus } from "lucide-react";
import CreatePostBar from "@/components/features/community/CreatePostBar";
import PostCard from "@/components/features/community/PostCard";
import { usersService } from "@/lib/api/services/users.service";
import { chatService } from "@/lib/api/services/chat.service";
import { useRouter } from "next/navigation";

interface ProfileFeedProps {
  userId?: string;
  isOwnProfile: boolean;
  userName: string;
  activeProfileTab: "posts" | "projects" | "media" | "friends" | "followers" | "following";
  setActiveProfileTab: (tab: "posts" | "projects" | "media" | "friends" | "followers" | "following") => void;
  posts: any[];
}

const UserGrid = memo(({ users, emptyMessage, onMessageClick }: { users: any[], emptyMessage: string, onMessageClick: (id: string) => void }) => {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center">
        <Users size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-400 text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4">
      {users.map((user) => (
        <motion.div
          key={user.id || user._id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
        >
          <Link href={`/dashboard/profile/${user.id || user._id}`} className="relative shrink-0 block">
            <Image
              src={user.avatar || "/images/avatar.png"}
              alt={user.name || user.username || "User"}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover group-hover:ring-2 ring-teal-500/50 transition-all border border-gray-100"
            />
            {user.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
            )}
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/dashboard/profile/${user.id || user._id}`}>
              <h4 className="text-sm font-bold text-gray-900 truncate hover:text-teal-700 transition-colors leading-snug">
                {user.name || user.username || "User"}
              </h4>
            </Link>
            <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">{user.role || "Member"}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button 
              onClick={() => onMessageClick(user.id || user._id)}
              className="p-2 rounded-full bg-gray-50 hover:bg-teal-50 text-gray-500 hover:text-[#103B40] border border-gray-100 transition-colors" 
              title="Message"
            >
              <MessageSquare size={15} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

UserGrid.displayName = "UserGrid";

const ProfileFeed = memo(({
  userId,
  isOwnProfile,
  userName,
  activeProfileTab,
  setActiveProfileTab,
  posts,
}: ProfileFeedProps) => {
  const router = useRouter();
  const [connectionsData, setConnectionsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConnections = useCallback(async () => {
    if (!userId) return;
    if (userId === "1" || userId === "2") {
      setConnectionsData([]);
      return;
    }
    if (["friends", "followers", "following"].includes(activeProfileTab)) {
      setIsLoading(true);
      try {
        let res;
        if (activeProfileTab === "friends") res = await usersService.getFriends(userId);
        else if (activeProfileTab === "followers") res = await usersService.getFollowers(userId);
        else if (activeProfileTab === "following") res = await usersService.getFollowing(userId);
        setConnectionsData(res?.data || res || []);
      } catch (err) {
        console.error(`Failed to fetch ${activeProfileTab}`, err);
        setConnectionsData([]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [userId, activeProfileTab]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const handleMessageClick = useCallback(async (id: string) => {
    try {
      const { conversationId } = await chatService.startChat(id);
      router.push(`/dashboard/messages?conversation=${conversationId}`);
    } catch (e) {
      router.push(`/dashboard/messages?user=${id}`);
    }
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="flex-1 min-w-0 space-y-4"
    >
      {isOwnProfile && <CreatePostBar userName={userName} />}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-3 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
        {[
          { id: "posts", label: "Posts", icon: FileText },
          { id: "projects", label: "Projects", icon: Briefcase },
          { id: "media", label: "Media", icon: ImageIcon },
          { id: "friends", label: "Friends", icon: UserCheck },
          { id: "followers", label: "Followers", icon: ArrowRight },
          { id: "following", label: "Following", icon: UserPlus }
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
          </div>
        )}
        {activeProfileTab === "media" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center">
            <Star size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm font-medium">No media yet</p>
          </div>
        )}
        
        {/* Dynamic Connections Grid */}
        {["friends", "followers", "following"].includes(activeProfileTab) && (
          isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#103B40]"></div>
            </div>
          ) : (
            <UserGrid 
              users={connectionsData} 
              emptyMessage={`No ${activeProfileTab} found`} 
              onMessageClick={handleMessageClick}
            />
          )
        )}
      </div>
    </motion.div>
  );
});

ProfileFeed.displayName = "ProfileFeed";

export default ProfileFeed;
