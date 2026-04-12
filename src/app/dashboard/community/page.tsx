"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, WifiOff, X, Loader2 } from "lucide-react";
import UserHeader from "@/components/ui/UserHeader";
import CreatePostBar from "@/components/features/community/CreatePostBar";
import PostCard, { PostData } from "@/components/features/community/PostCard";
import { useAvatar } from "@/store/useAvatarStore";

// Sample posts data
const SAMPLE_POSTS: PostData[] = [
  {
    id: "1",
    author: {
      id: "1",
      name: "Adel Ghamri",
      avatar: "/images/profile1.png",
      title: "Full-Stack Developer",
    },
    content:
      "Just shipped a new feature that reduces load time by 40%! The key was optimizing our database queries and implementing smart caching. Here's what worked...",
    image: "/images/post-placeholder.png",
    timestamp: "2h ago",
    likes: 24,
    comments: 8,
    shares: 2,
  },
  {
    id: "2",
    author: {
      id: "2",
      name: "Sara",
      avatar: "/images/profile2.png",
      title: "UI/UX Designer",
    },
    content:
      "Anyone else excited about the new design trends for 2024? I'm particularly loving the return to minimalism with bold typography. What are your thoughts?",
    timestamp: "4h ago",
    likes: 34,
    comments: 12,
    shares: 5,
  },
  {
    id: "3",
    author: {
      id: "3",
      name: "Parker",
      avatar: "/images/avatar.png",
      title: "Frontend Engineer",
    },
    content:
      "Quick tip: Always use semantic HTML elements. It's not just for accessibility — it also helps with SEO and makes your code more maintainable. Small changes, big impact! ✨",
    timestamp: "6h ago",
    likes: 24,
    comments: 6,
    shares: 3,
  },
  {
    id: "4",
    author: {
      id: "4",
      name: "William",
      avatar: "/images/avatar.png",
      title: "Product Manager",
    },
    content:
      "I'm trying to book an appointment but the assistant isn't picking up the phone. Can I book here?",
    timestamp: "8h ago",
    likes: 4,
    comments: 1,
    shares: 0,
  },
];

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<PostData[]>(SAMPLE_POSTS);
  const { avatar: globalAvatar } = useAvatar();
  const [showConnectionToast, setShowConnectionToast] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const feedRef = useRef<HTMLDivElement>(null);

  // Monitor network connection quality
  useEffect(() => {
    const checkConnection = () => {
      const nav = navigator as any;
      const conn = nav.connection || nav.mozConnection || nav.webkitConnection;

      if (!navigator.onLine) {
        setShowConnectionToast(true);
        return;
      }

      if (conn) {
        const slowTypes = ["slow-2g", "2g", "3g"];
        if (slowTypes.includes(conn.effectiveType) || (conn.downlink && conn.downlink < 1.5)) {
          setShowConnectionToast(true);
        }
      }
    };

    checkConnection();

    // Auto-dismiss toast after 5 seconds
    let timer: NodeJS.Timeout;
    const startDismissTimer = () => {
      timer = setTimeout(() => setShowConnectionToast(false), 5000);
    };

    const handleOffline = () => { setShowConnectionToast(true); startDismissTimer(); };
    const handleOnline = () => setShowConnectionToast(false);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    if (!navigator.onLine) startDismissTimer();

    const nav = navigator as any;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (conn) {
      conn.addEventListener("change", checkConnection);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      if (conn) conn.removeEventListener("change", checkConnection);
    };
  }, []);

  // Pull-to-refresh logic
  const PULL_THRESHOLD = 80;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isRefreshing) return;
    const scrollTop = feedRef.current?.scrollTop ?? window.scrollY;
    if (scrollTop > 5) return; // only trigger at top
    const diff = e.touches[0].clientY - touchStartY.current;
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.5, 120));
    }
  }, [isRefreshing]);

  const handleTouchEnd = useCallback(() => {
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(0);
      // Simulate fetching new posts
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1500);
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, isRefreshing]);

  const handleNewPost = (postData: {
    content: string;
    media?: File[];
    visibility: string;
  }) => {
    const newPost: PostData = {
      id: Date.now().toString(),
      author: {
        name: "Emad",
        avatar: globalAvatar || "/images/avatar.png",
        title: "Developer",
      },
      content: postData.content,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      shares: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="max-w-7xl mx-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <UserHeader name="Emad" badge="Developer" compact />

      {/* Poor Connection Toast */}
      <AnimatePresence>
        {showConnectionToast && (
          <motion.div
            initial={{ opacity: 0, y: -30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -30, x: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-5 left-1/2 z-[200] flex items-center gap-3 bg-[#103B40] text-white pl-4 pr-3 py-3 rounded-xl shadow-lg border border-white/10 min-w-[320px]"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 flex-shrink-0">
              <WifiOff size={16} className="text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Poor Connection</p>
              <p className="text-xs text-gray-300">Some features may be limited right now.</p>
            </div>
            <button
              onClick={() => setShowConnectionToast(false)}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white flex-shrink-0"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider */}
      <div className="h-px bg-gray-300 mb-5" />

      {/* Feed column – narrower like LinkedIn */}
      <div className="max-w-2xl mx-auto">
        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-500 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all shadow-sm"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 bg-white border border-gray-500 rounded-lg text-gray-500 hover:bg-gray-50 hover:border-gray-600 transition-all shadow-sm"
          >
            <SlidersHorizontal size={18} />
          </motion.button>
        </motion.div>

        {/* Create Post Bar */}
        <CreatePostBar userName="Emad" />

        {/* Pull-to-refresh indicator */}
        <AnimatePresence>
          {(pullDistance > 10 || isRefreshing) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-center py-4 mt-2"
            >
              <motion.div
                animate={isRefreshing ? { rotate: 360 } : { rotate: pullDistance * 3 }}
                transition={isRefreshing ? { repeat: Infinity, duration: 0.8, ease: "linear" } : { duration: 0 }}
              >
                <Loader2
                  size={24}
                  className={isRefreshing ? "text-teal-600" : "text-gray-400"}
                />
              </motion.div>
              {isRefreshing && (
                <span className="ml-2 text-sm text-gray-500">Refreshing...</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts feed */}
        <div className="space-y-4 mt-4" ref={feedRef}>
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.35 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}

          {filteredPosts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-400 text-sm">No posts found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}