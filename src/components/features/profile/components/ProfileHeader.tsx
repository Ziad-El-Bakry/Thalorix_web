import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  CheckCircle,
  MapPin,
  ExternalLink,
  MessageCircle,
  Settings,
  Eye,
  ChevronLeft,
  UserPlus,
  Clock,
  UserCheck,
  Trash2
} from "lucide-react";
import { usersService } from "@/lib/api/services/users.service";
import { chatService } from "@/lib/api/services/chat.service";
import { useChatStore } from "@/store/useChatStore";
import { useRouter } from "next/navigation";

interface ProfileHeaderProps {
  user: any;
  userBio: string;
  userName: string;
  isOwnProfile: boolean;
  coverImage: string;
  activeAvatar: string;
  displayRole: string;
  getRoleIcon: () => React.ReactNode;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  setIsPreviewModalOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  coverInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleResetAvatar?: () => void;
  triggerUpload: () => void;
  relationship?: any;
  setRelationship?: React.Dispatch<React.SetStateAction<any>>;
  postsCount?: number;
}

export default function ProfileHeader({
  user,
  userBio,
  userName,
  isOwnProfile,
  coverImage,
  activeAvatar,
  displayRole,
  getRoleIcon,
  isMenuOpen,
  setIsMenuOpen,
  setIsPreviewModalOpen,
  setIsSettingsOpen,
  fileInputRef,
  coverInputRef,
  handleFileChange,
  handleCoverChange,
  handleResetAvatar,
  triggerUpload,
  relationship,
  setRelationship,
  postsCount = 0
}: ProfileHeaderProps) {
  const router = useRouter();
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const onlineUserIds = useChatStore((state) => state.onlineUserIds);
  const isOnline = !isOwnProfile && user && onlineUserIds.includes(user.id || user._id);

  const handleToggleFollow = async () => {
    if (!user || !setRelationship) return;
    const oldVal = relationship?.isFollowing;
    setRelationship((prev: any) => ({ ...prev, isFollowing: !oldVal }));
    try {
      await usersService.toggleFollow(user.id || user._id);
    } catch (e) {
      setRelationship((prev: any) => ({ ...prev, isFollowing: oldVal }));
    }
  };

  const handleToggleFriend = async () => {
    if (!user || !setRelationship) return;
    const isFriend = relationship?.isFriend;
    const requestSent = relationship?.requestSent;
    const requestReceived = relationship?.requestReceived;

    // Optimistic Update logic
    let tempRel = { ...relationship };
    if (isFriend) {
       // Cannot unfriend directly from this button yet unless we add unfriend logic.
       return;
    } else if (requestSent) {
       tempRel.requestSent = false;
    } else if (requestReceived) {
       tempRel.isFriend = true;
       tempRel.requestReceived = false;
    } else {
       tempRel.requestSent = true;
    }
    setRelationship(tempRel);

    try {
      if (isFriend) {
        // Handle unfriend if needed
      } else if (requestSent) {
        await usersService.cancelFriendRequest(user.id || user._id);
      } else if (requestReceived) {
        await usersService.acceptFriendRequest(user.id || user._id);
      } else {
        await usersService.sendFriendRequest(user.id || user._id);
      }
    } catch (e) {
      setRelationship(relationship); // Revert
    }
  };

  const handleMessage = async () => {
    if (!user) return;
    setIsMessageLoading(true);
    try {
      const { conversationId } = await chatService.startChat(user.id || user._id);
      router.push(`/dashboard/messages?conversation=${conversationId}`);
    } catch (e) {
      console.error("Failed to start chat", e);
      router.push(`/dashboard/messages?user=${user.id || user._id}`);
    } finally {
      setIsMessageLoading(false);
    }
  };
  return (
    <>
      {!isOwnProfile && (
        <div className="mb-5 text-left flex">
          <Link href="/dashboard/community" className="inline-flex items-center justify-center p-2.5 text-gray-500 hover:text-[#103B40] transition-all bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:-translate-x-1">
            <ChevronLeft size={20} />
          </Link>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-5"
      >
        {/* Cover Banner */}
        <div className="relative h-[120px] md:h-[160px] overflow-hidden group bg-gradient-to-r from-teal-800 to-[#103B40]">
          <input type="file" ref={coverInputRef} onChange={handleCoverChange} accept="image/*" className="hidden" title="Upload cover image" />
          {coverImage ? (
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          )}
          {/* Edit Cover Overlay */}
          {isOwnProfile && (
            <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <motion.button onClick={() => coverInputRef.current?.click()} whileHover={{ scale: 1.05 }} className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-medium text-sm flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 transition-colors">
                <Camera size={16} /> Edit Cover Photo
              </motion.button>
            </div>
          )}
          {/* Developer Badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 right-4 z-20"
          >
            <span className="inline-flex items-center gap-1.5 bg-[#103B40]/90 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 shadow-lg">
              {getRoleIcon()}
              {displayRole}
            </span>
          </motion.div>
        </div>

        {/* Avatar + Info */}
        <div className="relative px-5 md:px-8 pb-4">
          {/* Avatar */}
          <div className="relative -mt-12 md:-mt-14 mb-2 inline-block group">
            {isOwnProfile && <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" title="Upload avatar image" />}
            <motion.div
              onClick={() => isOwnProfile && setIsMenuOpen(!isMenuOpen)}
              whileHover={isOwnProfile ? { scale: 1.03 } : undefined}
              className={`w-[96px] h-[96px] md:w-[110px] md:h-[110px] rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-xl flex items-center justify-center relative z-10 ${isOwnProfile ? "cursor-pointer" : ""}`}
            >
              <Image src={activeAvatar || "/images/avatar.png"} alt="Avatar" layout="fill" className="object-cover" />
              {isOwnProfile && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Camera size={24} className="text-white" />
                </div>
              )}
            </motion.div>
            {isOnline && (
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-white z-20 shadow-md animate-pulse" />
            )}
            {isOwnProfile && (
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 bg-[#103B40] text-white p-1.5 rounded-full shadow-md hover:bg-[#0c2e32] transition-colors z-20"
              >
                <Camera size={14} />
              </motion.button>
            )}

            {/* Dropdown overlay */}
            {isOwnProfile && isMenuOpen && <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)} />}
            <AnimatePresence>
              {isOwnProfile && isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-[100px] md:top-[115px] left-0 z-40 bg-white rounded-xl shadow-xl border border-gray-100 w-48 overflow-hidden"
                >
                  <button
                    onClick={() => { setIsMenuOpen(false); triggerUpload(); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium border-b border-gray-50"
                  >
                    <Camera size={16} className="text-[#103B40]" /> Change Image
                  </button>
                  <button
                    onClick={() => { setIsMenuOpen(false); setIsPreviewModalOpen(true); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium"
                  >
                    <Eye size={16} className="text-[#103B40]" /> Preview Image
                  </button>
                  {handleResetAvatar && (
                    <button
                      onClick={() => { setIsMenuOpen(false); handleResetAvatar(); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium border-t border-gray-50"
                    >
                      <Trash2 size={16} /> Reset Default
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Name row + actions */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-xl md:text-2xl font-bold text-[#103B40]">{userName}</h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                  <CheckCircle size={10} /> VERIFIED
                </span>
                {!isOwnProfile && (
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isOnline 
                      ? "text-green-700 bg-green-50 border-green-200" 
                      : "text-gray-500 bg-gray-50 border-gray-200"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                    {isOnline ? "ONLINE" : "OFFLINE"}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 font-medium mb-1 leading-relaxed max-w-2xl line-clamp-2 md:line-clamp-none">
                {userBio}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                <span className="flex items-center gap-1"><MapPin size={12} /> Cairo, Egypt</span>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium transition-colors">
                  <ExternalLink size={12} /> github.com/{userName.toLowerCase().replace(/\s+/g, '')}
                </a>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0 mt-2 md:mt-0">
              {!isOwnProfile && (
                <>
                  <motion.button 
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.97 }}
                    onClick={handleToggleFriend}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full shadow-sm transition-all flex items-center gap-1.5 ${
                      relationship?.isFriend 
                        ? "bg-teal-600 hover:bg-teal-700 text-white" 
                        : relationship?.requestSent 
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : relationship?.requestReceived
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-[#103B40] hover:bg-[#1a4f55] text-white"
                    }`}
                  >
                    {relationship?.isFriend ? (
                      <><UserCheck size={12} className="text-white" /><span>Friends</span></>
                    ) : relationship?.requestSent ? (
                      <><Clock size={12} className="text-white" /><span>Requested</span></>
                    ) : relationship?.requestReceived ? (
                      <><CheckCircle size={12} className="text-white" /><span>Accept Request</span></>
                    ) : (
                      <><UserPlus size={12} className="text-white" /><span>Add Friend</span></>
                    )}
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.97 }}
                    onClick={handleToggleFollow}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                      relationship?.isFollowing 
                        ? "bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100" 
                        : "bg-white border-[#103B40] text-[#103B40] hover:bg-gray-50"
                    }`}
                  >
                    {relationship?.isFollowing ? "Following" : "Follow"}
                  </motion.button>
                  <motion.button 
                    onClick={handleMessage}
                    disabled={isMessageLoading}
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.97 }} 
                    className="px-4 py-1.5 bg-white text-gray-700 text-xs font-semibold rounded-full border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-1.5"
                  >
                    <MessageCircle size={14} /> {isMessageLoading ? "Loading..." : "Message"}
                  </motion.button>
                </>
              )}
              {isOwnProfile && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all flex items-center justify-center"
                >
                  <Settings size={16} />
                </motion.button>
              )}
            </div>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-0 mt-4 border-t border-gray-100 pt-3"
          >
            {[
              { value: user?.followersCount || "0", label: "Followers" },
              { value: user?.followingCount || "0", label: "Following" },
              { value: user?.friendsCount || "0", label: "Friends" },
              { value: postsCount.toString(), label: "Posts" },
            ].map((stat, i) => (
              <div key={stat.label} className={`flex-1 text-center ${i > 0 ? "border-l border-gray-100" : ""}`}>
                <p className="text-lg font-bold text-[#103B40]">{stat.value}</p>
                <p className="text-[10px] text-gray-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
