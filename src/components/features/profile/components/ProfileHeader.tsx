import React from "react";
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
  ChevronLeft
} from "lucide-react";

interface ProfileHeaderProps {
  user: any;
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
  triggerUpload: () => void;
}

export default function ProfileHeader({
  user,
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
  triggerUpload,
}: ProfileHeaderProps) {
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
        <div className="relative h-[180px] md:h-[220px] overflow-hidden group bg-gradient-to-r from-teal-800 to-[#103B40]">
          <input type="file" ref={coverInputRef} onChange={handleCoverChange} accept="image/*" className="hidden" />
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
            <span className="inline-flex items-center gap-1.5 bg-[#103B40]/90 text-white text-xs font-bold px-3.5 py-1.5 rounded-full backdrop-blur-sm border border-white/10 shadow-lg">
              {getRoleIcon()}
              {displayRole}
            </span>
          </motion.div>
        </div>

        {/* Avatar + Info */}
        <div className="relative px-5 md:px-8 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-3 inline-block group">
            {isOwnProfile && <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />}
            <motion.div
              onClick={() => isOwnProfile && setIsMenuOpen(!isMenuOpen)}
              whileHover={isOwnProfile ? { scale: 1.03 } : undefined}
              className={`w-[120px] h-[120px] rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-xl flex items-center justify-center relative z-10 ${isOwnProfile ? "cursor-pointer" : ""}`}
            >
              <Image src={activeAvatar} alt="Avatar" layout="fill" className="object-cover" />
              {isOwnProfile && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Camera size={28} className="text-white" />
                </div>
              )}
            </motion.div>
            {isOwnProfile && (
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-1 right-1 bg-[#103B40] text-white p-2 rounded-full shadow-md hover:bg-[#0c2e32] transition-colors z-20"
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
                  className="absolute top-[125px] left-0 z-40 bg-white rounded-xl shadow-xl border border-gray-100 w-48 overflow-hidden"
                >
                  <button
                    onClick={() => { setIsMenuOpen(false); triggerUpload(); }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium border-b border-gray-50"
                  >
                    <Camera size={16} className="text-[#103B40]" /> Change Image
                  </button>
                  <button
                    onClick={() => { setIsMenuOpen(false); setIsPreviewModalOpen(true); }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium"
                  >
                    <Eye size={16} className="text-[#103B40]" /> Preview Image
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Name row + actions */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-2xl font-bold text-[#103B40]">{userName}</h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                  <CheckCircle size={12} /> VERIFIED
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Full Stack Developer · React · Node.js · Cloud Architecture
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                <span className="flex items-center gap-1"><MapPin size={13} /> Cairo, Egypt</span>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium transition-colors">
                  <ExternalLink size={13} /> github.com/{userName.toLowerCase()}
                </a>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              {!isOwnProfile && (
                <>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-5 py-2 bg-[#103B40] text-white text-sm font-semibold rounded-full shadow-sm hover:bg-[#1a4f55] transition-all">
                    Connect
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-5 py-2 bg-white text-[#103B40] text-sm font-semibold rounded-full border border-[#103B40] hover:bg-gray-50 transition-all">
                    Follow
                  </motion.button>
                  <Link href={`/dashboard/messages?user=${user?.id}`} className="block">
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-5 py-2 bg-white text-gray-700 text-sm font-semibold rounded-full border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-1.5">
                      <MessageCircle size={16} /> Message
                    </motion.button>
                  </Link>
                </>
              )}
              {isOwnProfile && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all flex items-center justify-center"
                >
                  <Settings size={18} />
                </motion.button>
              )}
            </div>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-0 mt-6 border-t border-gray-100 pt-5"
          >
            {[
              { value: "1.4k", label: "Connections" },
              { value: "3.2k", label: "Profile Views" },
              { value: "18.4k", label: "Impressions" },
              { value: "47", label: "Posts" },
            ].map((stat, i) => (
              <div key={stat.label} className={`flex-1 text-center ${i > 0 ? "border-l border-gray-100" : ""}`}>
                <p className="text-xl font-bold text-[#103B40]">{stat.value}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
