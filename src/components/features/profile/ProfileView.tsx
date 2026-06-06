"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, LogOut, Trash2, Code, Shield, Store, User as UserIcon, FileText, Briefcase, Image as ImageIcon, UserCheck, ArrowRight, UserPlus } from "lucide-react";

import { authService } from "@/lib/api/services/auth.service";
import { usersService } from "@/lib/api/services/users.service";
import { useAvatar } from "@/store/useAvatarStore";
import { usePostStore } from "@/store/usePostStore";
import { LogoutModal, DeleteAccountModal } from "@/components/shared/ProfileModals";

import { EXPERTISE } from "./components/profile.constants";
import ProfileHeader from "./components/ProfileHeader";
import ProfileFeed from "./components/ProfileFeed";
import ProfileRightSidebar from "./components/ProfileRightSidebar";
import ProfileSettingsModal from "./components/ProfileSettingsModal";

type SettingsTab = "personal" | "password";

export default function ProfileView({ userId, isOwnProfile = false }: { userId?: string, isOwnProfile?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [relationship, setRelationship] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { avatar: globalAvatar, setAvatar: setGlobalAvatar } = useAvatar();
  const [displayAvatar, setDisplayAvatar] = useState("/images/avatar.png");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("personal");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<"posts" | "projects" | "media" | "friends" | "followers" | "following">("posts");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverImage, setCoverImage] = useState<string>("/images/profile-cover.png");
  const [expertiseData, setExpertiseData] = useState(EXPERTISE);
  const [socialLinksData, setSocialLinksData] = useState({ facebook: "", instagram: "" });

  const displayRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Developer";
  const getRoleIcon = () => {
    if (!user?.role) return <Code size={14} />;
    const roleStr = user.role.toLowerCase();
    if (roleStr === 'admin') return <Shield size={14} />;
    if (roleStr === 'seller') return <Store size={14} />;
    if (roleStr === 'user') return <UserIcon size={14} />;
    return <Code size={14} />;
  };

  useEffect(() => {
    if (user) {
      if (user.expertise && user.expertise.length > 0) {
        setExpertiseData(user.expertise);
      }
      if (user.socialLinks) {
        setSocialLinksData(user.socialLinks);
      }
    }
  }, [user]);

  useEffect(() => {
    if (searchParams && searchParams.get("settings") === "open") {
      setIsSettingsOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    try {
      if (isOwnProfile) {
        const storedCover = localStorage.getItem("thalorix_user_cover");
        if (storedCover) setCoverImage(storedCover);
        else setCoverImage("/images/profile-cover.png");
      } else {
        setCoverImage("");
      }
    } catch { }
  }, [isOwnProfile]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let idToFetch = userId;
        const storedUser = authService.getStoredUser();

        // 🚀 Optimistic UI: Pre-load local stored user data instantly for own profile
        if (isOwnProfile && storedUser) {
          setUser(storedUser);
          if (storedUser.avatar) {
            setDisplayAvatar(storedUser.avatar);
            setGlobalAvatar(storedUser.avatar);
          }
        }

        if (!idToFetch) {
          idToFetch = storedUser?.id || (storedUser as any)?._id;
        }

        // Mock users for feed placeholders
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
          if (data) {
            if (data.role === "seller") {
              router.replace(`/dashboard/seller/${idToFetch}`);
              return;
            }
            setUser(data);
            if (!isOwnProfile) {
              try {
                const relData = await usersService.getRelationship(idToFetch);
                setRelationship(relData);
              } catch (err) {
                console.warn("Failed to fetch relationship data", err);
              }
            }
            if (data.avatar) {
              setDisplayAvatar(data.avatar);
              if (isOwnProfile) {
                setGlobalAvatar(data.avatar);
              }
            }
          }
        }
      } catch (error: any) {
        if (error?.response?.status === 401) {
          console.warn("User unauthorized, token might be expired.");
        } else {
          console.warn("Failed to fetch user data:", error?.message || error);
        }
        // Graceful fallback to stored user if API failed for own profile
        const storedUser = authService.getStoredUser();
        if (isOwnProfile && storedUser) {
          setUser(storedUser);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId, isOwnProfile]);

  const triggerUpload = () => fileInputRef.current?.click();

  const fireToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogoutClick = () => {
    setIsSettingsOpen(false);
    setIsLogoutModalOpen(true);
  };
  
  const handleDeleteAccountClick = () => {
    setIsSettingsOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      setIsLogoutModalOpen(false);
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccountConfirm = async () => {
    if (!user?.id) return;
    setIsDeleting(true);
    try {
      await usersService.deleteUser(user.id);
      await authService.logout();
      setIsDeleteModalOpen(false);
      router.push("/login");
    } catch (error) {
      console.error("Failed to delete account:", error);
      fireToast("Failed to delete account");
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
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
          if (user?.id || user?._id) {
            await usersService.updateProfile(user.id || user._id, { avatarUrl });
            // Update local storage user
            const updatedUser = { ...user, avatar: avatarUrl };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
        }
        fireToast("Profile photo updated!");
      } catch (error: any) {
        if (error?.response?.status === 401) {
          console.warn("Unauthorized to upload avatar.");
        } else {
          console.warn("Failed to upload avatar:", error?.message || error);
        }
        fireToast("Failed to upload avatar. Please try again.");
      }
    }
  };

  const handleResetAvatar = async () => {
    if (user?.id || user?._id) {
      try {
        await usersService.updateProfile(user.id || user._id, { avatarUrl: "" });
        setDisplayAvatar("");
        setGlobalAvatar("");
        const updatedUser = { ...user, avatar: "" };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        fireToast("Profile photo reset to default!");
      } catch (error) {
        console.error("Failed to reset avatar:", error);
        fireToast("Failed to reset avatar. Please try again.");
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
      fireToast("Cover photo updated!");
    }
  };

  const userName = user?.name || user?.username || "User";
  const userBio = user?.bio || "Passionate Full Stack Developer with 6+ years building scalable apps and APIs. Open source contributor, tech speaker, lifelong learner. Currently building developer tools at Thalorix to empower the next generation of engineers. 🚀";

  const activeAvatar = isOwnProfile ? globalAvatar : displayAvatar;

  const { posts: globalPosts, fetchFeed } = usePostStore();
  const posts = globalPosts
    .filter((p: any) => isOwnProfile ? (p.author.name === userName || p.author.name === "Emad" || p.id.startsWith("p") || p.author.id === "1") : (user && p.author.name === user.name))
    .map((p: any) => ({
      ...p,
      author: { ...p.author, name: isOwnProfile ? userName : p.author.name, avatar: isOwnProfile ? activeAvatar : p.author.avatar }
    }));

  useEffect(() => {
    if (globalPosts.length === 0) {
      fetchFeed();
    }
  }, [fetchFeed, globalPosts.length]);

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
              <button onClick={() => setIsPreviewModalOpen(false)} className="absolute top-0 right-0 md:-top-6 md:-right-6 bg-white/10 hover:bg-white/25 p-2 rounded-full text-white backdrop-blur-md transition-colors border border-white/20 z-10" title="Close preview">
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
            className="fixed top-4 left-1/2 z-[9999] w-full max-w-sm pointer-events-none"
          >
            <div className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow-2xl text-white text-sm font-bold bg-[#1fce81] border border-white/20">
              <CheckCircle size={18} />
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Settings Modal ─── */}
      <ProfileSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settingsTab={settingsTab}
        setSettingsTab={setSettingsTab}
        user={user}
        setUser={setUser}
        expertiseData={expertiseData}
        setExpertiseData={setExpertiseData}
        socialLinksData={socialLinksData}
        setSocialLinksData={setSocialLinksData}
        fireToast={fireToast}
        handleLogoutClick={handleLogoutClick}
        handleDeleteAccountClick={handleDeleteAccountClick}
      />

      {/* ═══════════════════════════════════════
          PROFILE HEADER
         ═══════════════════════════════════════ */}
      <ProfileHeader
        user={user}
        userName={user?.name || user?.username || "Developer"}
        userBio={userBio}
        isOwnProfile={isOwnProfile}
        coverImage={coverImage}
        activeAvatar={displayAvatar}
        displayRole={displayRole}
        getRoleIcon={getRoleIcon}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setIsPreviewModalOpen={setIsPreviewModalOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        fileInputRef={fileInputRef}
        coverInputRef={coverInputRef}
        handleFileChange={handleFileChange}
        handleCoverChange={handleCoverChange}
        handleResetAvatar={handleResetAvatar}
        triggerUpload={triggerUpload}
        relationship={relationship}
        setRelationship={setRelationship}
        postsCount={posts.length}
      />

      {/* ═══════════════════════════════════════
          THREE COLUMN BODY (Left Nav + Feed + Right Sidebar)
         ═══════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Vertical Nav */}
        <div className="w-full lg:w-[220px] flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:sticky lg:top-24 flex flex-row lg:flex-col gap-1.5 overflow-x-auto scrollbar-hide"
          >
          <h3 className="hidden lg:block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2 px-3 pt-2">Menu</h3>
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
                className={`flex-shrink-0 lg:flex-shrink w-auto lg:w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200 flex items-center gap-3 ${
                  isActive
                    ? "bg-[#103B40] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#103B40]"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
          </motion.div>
        </div>

        <ProfileFeed
          userId={user?.id || user?._id || userId}
          isOwnProfile={isOwnProfile}
          userName={user?.name || user?.username || "Developer"}
          activeProfileTab={activeProfileTab}
          setActiveProfileTab={setActiveProfileTab}
          posts={posts}
        />
        
        <ProfileRightSidebar />
      </div>

      {/* ═══════════════════════════════════════
          MODALS
         ═══════════════════════════════════════ */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        isLoggingOut={isLoggingOut}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccountConfirm}
      />
    </div>
  );
}
