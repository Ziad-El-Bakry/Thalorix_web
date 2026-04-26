"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera, Copy, Lock, Trash2, CheckCircle, AlertCircle,
  Eye, EyeOff, X, LogOut, MapPin, ExternalLink, Code,
  Heart, MessageCircle, Award, TrendingUp, UserPlus,
  ChevronRight, ChevronLeft, Bookmark, Settings, MoreHorizontal,
  Hash, Zap, Star, Briefcase, GraduationCap, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Notifications from "@/components/shared/Notification";
import { authService } from "@/lib/api/services/auth.service";
import { usersService } from "@/lib/api/services/users.service";
import { useAvatar } from "@/store/useAvatarStore";
import CreatePostBar from "@/components/features/community/CreatePostBar";
import PostCard, { PostData } from "@/components/features/community/PostCard";

type SettingsTab = "personal" | "password";

/* ───── Sample data (placeholder) ───── */

const EXPERTISE = [
  { name: "React / Next.js", percent: 96 },
  { name: "Node.js / Express", percent: 92 },
  { name: "TypeScript", percent: 88 },
  { name: "Cloud (AWS/GCP)", percent: 80 },
  { name: "Python / Django", percent: 75 },
];

const EXPERIENCE = [
  { initials: "TT", color: "#103B40", role: "Senior Full Stack Developer", company: "Thalorix Technologies", dates: "2023 – Present" },
  { initials: "DS", color: "#2563eb", role: "Full Stack Developer", company: "DevStream Inc.", dates: "2020 – 2022" },
  { initials: "PF", color: "#7c3aed", role: "Frontend Developer", company: "PixelForge Labs", dates: "2018 – 2020" },
];

const CERTIFICATIONS = [
  { icon: "🏅", name: "AWS Solutions Architect", org: "Amazon · 2023" },
  { icon: "☁️", name: "Google Cloud Professional", org: "Google · 2022" },
  { icon: "⚛️", name: "Meta React Developer", org: "Meta · 2022" },
];

const EDUCATION = [
  { icon: "🎓", degree: "B.Sc Computer Science", school: "University of Lagos", dates: "2014 – 2018" },
];

const LIVE_ACTIVITY = [
  { icon: Heart, color: "text-pink-500", text: "Maher liked your post", time: "3h ago" },
  { icon: MessageCircle, color: "text-blue-500", text: "Alex commented on your article", time: "14m ago" },
  { icon: Award, color: "text-amber-500", text: "You hit 1,400 connections!", time: "1h ago" },
  { icon: Bookmark, color: "text-teal-500", text: "Priya shared your post", time: "3h ago" },
];

const PROFILE_INSIGHTS = [
  { label: "Profile views", value: "2,347", change: "+12%", positive: true },
  { label: "Post impressions", value: "18.4k", change: "+28%", positive: true },
  { label: "Search appearances", value: "321", change: "-4%", positive: false },
];

const NETWORK_SUGGESTIONS = [
  { initials: "AJ", color: "#2563eb", name: "Alex Johnson", title: "UX Designer · 12 m" },
  { initials: "PS", color: "#7c3aed", name: "Priya Sharma", title: "Product Manager · 8 m" },
  { initials: "KC", color: "#dc2626", name: "Kevin Choi", title: "DevOps Engineer · 5 m" },
  { initials: "LF", color: "#059669", name: "Lena Fischer", title: "AI Researcher · 14 m" },
];

const TRENDING = [
  { tag: "#OpenSource", posts: "2.7k posts" },
  { tag: "#ReactJS", posts: "1.3k posts" },
  { tag: "#AITools", posts: "4.1k posts" },
  { tag: "#WebDev", posts: "3.2k posts" },
  { tag: "#NodeJS", posts: "987 posts" },
];

const PROFILE_POSTS: PostData[] = [
  {
    id: "p1",
    author: { name: "User", avatar: "/images/avatar.png", title: "Full Stack Developer" },
    content: "🚀 Just launched a real-time collaboration tool — React, WebSockets & Node.js. Live cursors, shared state, conflict-free merging. Drop a ⭐ if you like it! #OpenSource #React #WebSockets",
    image: "/images/post-placeholder.png",
    timestamp: "2h ago",
    likes: 247,
    comments: 38,
    shares: 12,
  },
  {
    id: "p2",
    author: { name: "User", avatar: "/images/avatar.png", title: "Full Stack Developer" },
    content: "Explored GPT-4 Turbo for developer tooling 🔥\nKey insight: The most dangerous AI won't have bad intentions — it'll just have bad developers.\n#AI #DevTools",
    timestamp: "3d ago",
    likes: 183,
    comments: 52,
    shares: 8,
  },
  {
    id: "p3",
    author: { name: "User", avatar: "/images/avatar.png", title: "Full Stack Developer" },
    content: "Stop using useEffect for everything\n🔴 • useMemo for values •\nuseCallback for functions •\nReact.memo prevents re-renders.\nSave this post.",
    timestamp: "3d ago",
    likes: 312,
    comments: 44,
    shares: 21,
  },
];

/* ═══════════════════════════════════════════
   MAIN PROFILE PAGE
   ═══════════════════════════════════════════ */

export default function ProfileView({ userId, isOwnProfile = false }: { userId?: string, isOwnProfile?: boolean }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const { avatar: globalAvatar, setAvatar: setGlobalAvatar } = useAvatar();
  const [displayAvatar, setDisplayAvatar] = useState("/images/avatar.png");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("personal");
  const [activeProfileTab, setActiveProfileTab] = useState<"posts" | "projects" | "media">("posts");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverImage, setCoverImage] = useState<string>("/images/profile-cover.png");
  const [expertiseData, setExpertiseData] = useState(EXPERTISE);

  useEffect(() => {
    try {
      if (isOwnProfile) {
        const storedCover = localStorage.getItem("thalorix_user_cover");
        if (storedCover) setCoverImage(storedCover);
        else setCoverImage("/images/profile-cover.png");
      } else {
        setCoverImage("");
      }
    } catch {}
  }, [isOwnProfile]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let idToFetch = userId;
        if (!idToFetch) {
          const storedUser = authService.getStoredUser();
          idToFetch = storedUser?.id;
        }

        // Mock users for feed placeholders (Adel=1, Sara=2)
        if (idToFetch === "1") {
          setUser({ id: "1", username: "Adel Ghamri", bio: "Full-Stack Developer shipping code." });
          setDisplayAvatar("/images/profile1.png");
          setLoading(false);
          return;
        } else if (idToFetch === "2") {
          setUser({ id: "2", username: "Sara", bio: "UI/UX Designer exploring minimal spaces." });
          setDisplayAvatar("/images/profile2.png");
          setLoading(false);
          return;
        }
        
        if (idToFetch) {
          const data = await usersService.getUserById(idToFetch);
          setUser(data);
          if (data.avatar && !isOwnProfile) {
             setDisplayAvatar(data.avatar);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(user?.id || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isOwnProfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDisplayAvatar(reader.result as string);
        setGlobalAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
      try {
        const { avatarUrl } = await usersService.uploadAvatar(file);
        if (avatarUrl) {
          setDisplayAvatar(avatarUrl);
          setGlobalAvatar(avatarUrl);
        }
        fireToast("Profile photo updated!");
      } catch (error) {
        console.error("Failed to upload avatar:", error);
      }
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isOwnProfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCoverImage(result);
        try {
          localStorage.setItem("thalorix_user_cover", result);
        } catch (err) {
          console.warn("Could not save cover to localStorage", err);
        }
      };
      reader.readAsDataURL(file);
      // Backend upload would go here
      fireToast("Cover photo updated!");
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

  const fireToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmDelete) {
      try {
        await usersService.deleteUser(user.id);
        await authService.logout();
        router.push("/login");
      } catch (error) {
        console.error("Failed to delete account:", error);
        alert("Failed to delete account");
      }
    }
  };

  const userName = user?.username || "User";
  const userBio = user?.bio || "Passionate Full Stack Developer with 6+ years building scalable apps and APIs. Open source contributor, tech speaker, lifelong learner. Currently building developer tools at Thalorix to empower the next generation of engineers. 🚀";

  const activeAvatar = isOwnProfile ? globalAvatar : displayAvatar;

  // Update post author avatars to match current user
  const posts = PROFILE_POSTS.map(p => ({
    ...p,
    author: { ...p.author, name: userName, avatar: activeAvatar }
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#103B40]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto relative">
      {/* ─── Image Preview Modal ─── */}
      <AnimatePresence>
        {isPreviewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setIsPreviewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full flex items-center justify-center p-6"
              onClick={(e: any) => e.stopPropagation()}
            >
              <img src={activeAvatar} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
              <button onClick={() => setIsPreviewModalOpen(false)} className="absolute top-0 right-0 md:-top-6 md:-right-6 bg-white/10 hover:bg-white/25 p-2 rounded-full text-white backdrop-blur-md transition-colors border border-white/20 z-10">
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Toast ─── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -100, opacity: 0, x: "-50%" }}
            animate={{ y: 20, opacity: 1, x: "-50%" }}
            exit={{ y: -100, opacity: 0, x: "-50%" }}
            className="fixed top-0 left-1/2 z-[100] w-full max-w-sm"
          >
            <div className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow-2xl text-white text-sm font-bold bg-[#1fce81] border border-white/20">
              <CheckCircle size={18} />
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Settings Modal ─── */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[6vh] px-4"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
              onClick={(e: any) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Settings size={20} className="text-[#103B40]" />
                  <h2 className="text-lg font-bold text-[#103B40]">Edit Profile</h2>
                </div>
                <button onClick={() => setIsSettingsOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              {/* Settings tabs */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setSettingsTab("personal")}
                  className={`flex-1 py-3 text-sm font-semibold transition-all ${settingsTab === "personal" ? "text-[#103B40] border-b-2 border-[#103B40]" : "text-gray-400 hover:text-gray-600"}`}
                >
                  Personal Details
                </button>
                <button
                  onClick={() => setSettingsTab("password")}
                  className={`flex-1 py-3 text-sm font-semibold transition-all ${settingsTab === "password" ? "text-[#103B40] border-b-2 border-[#103B40]" : "text-gray-400 hover:text-gray-600"}`}
                >
                  Change Password
                </button>
              </div>

              {/* Settings content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={settingsTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    {settingsTab === "personal" ? (
                      <PersonalDetails user={user} onSave={() => fireToast("Profile updated successfully!")} expertise={expertiseData} setExpertise={setExpertiseData} />
                    ) : (
                      <ChangePassword user={user} onSave={() => fireToast("Password updated successfully!")} onCancel={() => setSettingsTab("personal")} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Danger zone */}
              <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium">
                  <LogOut size={16} /> Logout
                </button>
                <button onClick={handleDeleteAccount} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors font-medium">
                  <Trash2 size={16} /> Delete Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════
          PROFILE HEADER
         ═══════════════════════════════════════ */}

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
              <Code size={14} />
              {"</>"} Developer
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

      {/* ═══════════════════════════════════════
          THREE COLUMN BODY
         ═══════════════════════════════════════ */}

      <div className="flex flex-col lg:flex-row gap-5">

        {/* ─── LEFT SIDEBAR ─── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full lg:w-[280px] flex-shrink-0 space-y-5"
        >
          {/* About */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">About</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{userBio}</p>
          </div>

          {/* Expertise */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Expertise</h3>
            <div className="space-y-3.5">
              {expertiseData.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                    <span className="text-xs text-gray-400 font-semibold">{skill.percent}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.percent}%` }}
                      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, #103B40 0%, #1fce81 100%)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Experience</h3>
            <div className="space-y-4">
              {EXPERIENCE.map((exp, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: exp.color }}
                  >
                    {exp.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{exp.role}</p>
                    <p className="text-xs text-teal-600 font-medium">{exp.company}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{exp.dates}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Certifications</h3>
            <div className="space-y-3">
              {CERTIFICATIONS.map((cert, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-lg">{cert.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{cert.name}</p>
                    <p className="text-[11px] text-gray-400">{cert.org}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Education</h3>
            <div className="space-y-3">
              {EDUCATION.map((edu, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-lg">{edu.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{edu.degree}</p>
                    <p className="text-xs text-teal-600 font-medium">{edu.school}</p>
                    <p className="text-[11px] text-gray-400">{edu.dates}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ─── CENTER FEED ─── */}
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
            {activeProfileTab === "posts" && posts.map((post, idx) => (
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

        {/* ─── RIGHT SIDEBAR ─── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="w-full lg:w-[280px] flex-shrink-0 space-y-5"
        >
          {/* Live Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Live Activity</h3>
            <div className="space-y-3.5">
              {LIVE_ACTIVITY.map((item, i) => (
                <div key={i} className="flex items-start gap-3 group cursor-pointer">
                  <div className={`mt-0.5 ${item.color}`}>
                    <item.icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 font-medium leading-tight group-hover:text-[#103B40] transition-colors">{item.text}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Insights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Profile Insights</h3>
            <div className="space-y-3">
              {PROFILE_INSIGHTS.map((insight, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{insight.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#103B40]">{insight.value}</span>
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${insight.positive ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}`}>
                      {insight.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-3 text-right italic">Top 20% this week</p>
          </div>

          {/* Grow Your Network */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Grow Your Network</h3>
            <div className="space-y-3">
              {NETWORK_SUGGESTIONS.map((person, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: person.color }}
                  >
                    {person.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{person.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{person.title}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-0.5 flex-shrink-0"
                  >
                    <UserPlus size={13} /> Add
                  </motion.button>
                </div>
              ))}
              <button className="w-full text-center text-xs font-semibold text-teal-600 hover:text-teal-700 mt-2 transition-colors flex items-center justify-center gap-1">
                View all suggestions <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Trending Now */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Trending Now</h3>
            <div className="space-y-2.5">
              {TRENDING.map((item, i) => (
                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                  <span className="text-sm font-bold text-gray-300 w-4">{i + 1}</span>
                  <div>
                    <p className="text-sm font-bold text-teal-600 group-hover:text-teal-700 transition-colors">{item.tag}</p>
                    <p className="text-[11px] text-gray-400">{item.posts}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-3 space-y-1">
            <div className="flex items-center justify-center gap-3 text-[11px] text-gray-400">
              <a href="#" className="hover:text-gray-600 transition-colors">About</a>
              <span>·</span>
              <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
              <span>·</span>
              <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
              <span>·</span>
              <a href="#" className="hover:text-gray-600 transition-colors">Help</a>
            </div>
            <p className="text-[11px] text-gray-300">© 2026 Thalorix</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   PERSONAL DETAILS FORM
   ═══════════════════════════════════════ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

function PersonalDetails({ user, onSave, expertise, setExpertise }: { user: any; onSave: () => void; expertise: any[]; setExpertise: (e: any[]) => void }) {
  const [username, setUsername] = useState(user?.username || "");
  const [email] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [emailError, setEmailError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setEmailError("");
    if (!user?.id) return;
    setIsSaving(true);
    try {
      await usersService.updateProfile(user.id, { username, bio });
      onSave();
    } catch (error: any) {
      console.error("Failed to update profile", error);
      setEmailError(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
      <motion.div variants={itemVariants} className="mb-5">
        <label className="block text-xs font-semibold text-gray-700 mb-2">Username</label>
        <Input value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} className="bg-gray-50 border border-gray-200 shadow-sm h-11" />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-5">
        <label className="block text-xs font-semibold text-gray-700 mb-2">Email Address</label>
        <Input value={email} disabled className="bg-gray-100 shadow-sm h-11 border border-gray-200 text-gray-500 cursor-not-allowed" />
        <AnimatePresence>
          {emailError && (
            <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-xs text-red-500 mt-2 flex items-center gap-1.5 font-medium overflow-hidden">
              <AlertCircle size={14} className="fill-red-500 text-white" />
              {emailError}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <label className="block text-xs font-semibold text-gray-700 mb-2">Bio</label>
        <textarea
          value={bio}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
          className="w-full border border-gray-200 shadow-sm rounded-lg p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-teal-200 bg-gray-50 transition-all text-sm"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6 border-t border-gray-100 pt-6">
        <h3 className="text-sm font-bold mb-4 text-[#103B40]">Social Media Accounts</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Facebook</label>
            <Input defaultValue="" className="bg-gray-50 border border-gray-200 shadow-sm h-11" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Instagram</label>
            <Input defaultValue="" className="bg-gray-50 border border-gray-200 shadow-sm h-11" />
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6 border-t border-gray-100 pt-6">
        <h3 className="text-sm font-bold mb-4 text-[#103B40]">Expertise Percentages</h3>
        {expertise?.map((exp, index) => (
          <div key={index} className="flex gap-4 mb-3">
             <div className="flex-1">
               <label className="block text-xs font-semibold text-gray-700 mb-1">Skill</label>
               <Input value={exp.name} onChange={(e: any) => {
                 const newExp = [...expertise];
                 newExp[index].name = e.target.value;
                 setExpertise(newExp);
               }} className="bg-gray-50 border border-gray-200 shadow-sm h-10 text-sm" />
             </div>
             <div className="w-24">
               <label className="block text-xs font-semibold text-gray-700 mb-1">Percent (%)</label>
               <Input type="number" min="0" max="100" value={exp.percent} onChange={(e: any) => {
                 const newExp = [...expertise];
                 newExp[index].percent = Number(e.target.value);
                 setExpertise(newExp);
               }} className="bg-gray-50 border border-gray-200 shadow-sm h-10 text-sm" />
             </div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} variant="primary" className="bg-[#103B40] hover:bg-[#0c2e32] h-10 shadow-md font-medium px-8 transition-transform hover:scale-105 active:scale-95 disabled:opacity-70">
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   CHANGE PASSWORD FORM
   ═══════════════════════════════════════ */

function ChangePassword({ user, onSave, onCancel }: { user: any; onSave: () => void; onCancel: () => void }) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSave = async () => {
    setError("");
    if (!oldPassword) { setError("Please enter your current password."); return; }
    if (!newPassword) { setError("Please enter a new password."); return; }
    if (!passwordRegex.test(newPassword)) { setError("New password must be at least 8 characters long and include uppercase, lowercase, number, and special character."); return; }
    if (newPassword !== confirmNewPassword) { setError("New passwords do not match."); return; }
    setIsSaving(true);
    try {
      await usersService.changePassword({ currentPassword: oldPassword, newPassword, confirmPassword: confirmNewPassword });
      onSave();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
      <motion.div variants={itemVariants} className="mb-5">
        <label className="block text-xs font-semibold text-gray-700 mb-2">Email</label>
        <Input value={user?.email || ""} disabled className="bg-gray-100 border border-gray-200 shadow-sm h-11 text-gray-500" />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-5 relative">
        <label className="block text-xs font-semibold text-gray-700 mb-2">Current Password</label>
        <div className="relative">
          <Input type={showOldPassword ? "text" : "password"} value={oldPassword} onChange={(e: any) => setOldPassword(e.target.value)} className="bg-gray-50 border border-gray-200 shadow-sm h-11 pr-10" />
          <motion.button whileTap={{ scale: 0.8 }} type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </motion.button>
        </div>
        <div className="mt-2 text-right">
          <Link href="/forget-password" className="text-xs font-semibold text-[#103B40] hover:underline transition-all">Forgot your password?</Link>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-5 relative">
        <label className="block text-xs font-semibold text-gray-700 mb-2">New Password</label>
        <div className="relative">
          <Input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e: any) => setNewPassword(e.target.value)} className="bg-gray-50 border border-gray-200 shadow-sm h-11 pr-10" />
          <motion.button whileTap={{ scale: 0.8 }} type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </motion.button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-4 relative">
        <label className="block text-xs font-semibold text-gray-700 mb-2">Confirm New Password</label>
        <div className="relative">
          <Input type={showConfirmPassword ? "text" : "password"} value={confirmNewPassword} onChange={(e: any) => setConfirmNewPassword(e.target.value)} className="bg-gray-50 border border-gray-200 shadow-sm h-11 pr-10" />
          <motion.button whileTap={{ scale: 0.8 }} type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="text-xs text-red-500 mb-4 flex items-start gap-1.5 font-medium leading-tight overflow-hidden">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onCancel} className="flex-1 bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 h-10 shadow-sm font-medium">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving} variant="primary" className="flex-1 bg-[#103B40] hover:bg-[#0c2e32] h-10 shadow-md font-medium disabled:opacity-70">
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </motion.div>
    </motion.div>
  );
}