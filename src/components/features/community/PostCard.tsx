"use client";

import { useState } from "react";
import Image from "next/image";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Send, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAvatar } from "@/store/useAvatarStore";
import { authService } from "@/lib/api/services/auth.service";

export interface PostData {
  id: string;
  author: {
    name: string;
    avatar: string;
    title?: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  liked?: boolean;
}

// individual comment
interface CommentData {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
}

export default function PostCard({ post }: { post: PostData }) {
  const [liked, setLiked] = useState(post.liked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<CommentData[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const { avatar: globalAvatar } = useAvatar();

  const CONTENT_LIMIT = 200;
  const isLongContent = post.content.length > CONTENT_LIMIT;

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const currentUser = authService.getStoredUser();
    
    const newComment: CommentData = {
      id: Date.now().toString(),
      author: currentUser?.username || "User",
      avatar: globalAvatar || "/images/avatar.png",
      text: commentText,
      time: "Just now",
    };
    setComments((prev) => [...prev, newComment]);
    setCommentCount((prev) => prev + 1);
    setCommentText("");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Author row */}
      <div className="flex items-start justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={44}
            height={44}
            className="w-10 h-10 rounded-full object-cover shadow-sm flex-shrink-0"
          />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 leading-tight">
              {post.author.name}
            </h4>
            {post.author.title && (
              <p className="text-xs text-gray-500 mt-0.5">{post.author.title}</p>
            )}
            <p className="text-[11px] text-gray-400 mt-0.5">{post.timestamp}</p>
          </div>
        </div>
        <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {isLongContent && !showMore
            ? post.content.slice(0, CONTENT_LIMIT) + "..."
            : post.content}
        </p>
        {isLongContent && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-gray-500 hover:text-teal-600 text-xs font-medium mt-1 transition-colors"
          >
            {showMore ? "Show less" : "See more"}
          </button>
        )}
      </div>

      {/* Image */}
      {post.image && (
        <div className="border-t border-b border-gray-100">
          <img
            src={post.image}
            alt="Post media"
            className="w-full max-h-[400px] object-cover"
          />
        </div>
      )}

      {/* Stats row */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-500 text-white text-[10px]">
            👍
          </span>
          <span>{likeCount}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:text-teal-600 hover:underline transition-colors cursor-pointer"
          >
            {commentCount} comments
          </button>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-4" />

      {/* Action buttons */}
      <div className="flex items-center justify-around px-2 py-1">
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={handleLike}
          className={`flex items-center gap-2 flex-1 justify-center py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50 ${
            liked ? "text-teal-600" : "text-gray-500"
          }`}
        >
          <ThumbsUp size={18} className={liked ? "fill-teal-600" : ""} />
          <span className="hidden sm:inline">Like</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 flex-1 justify-center py-2.5 rounded-lg text-sm font-medium text-gray-500 transition-all duration-200 hover:bg-gray-50"
        >
          <MessageCircle size={18} />
          <span className="hidden sm:inline">Comment</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={handleShare}
          className={`flex items-center gap-2 flex-1 justify-center py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50 ${
            isShared ? "text-teal-600" : "text-gray-500"
          }`}
        >
          {isShared ? <Check size={18} /> : <Share2 size={18} />}
          <span className="hidden sm:inline">{isShared ? "Copied Link" : "Share"}</span>
        </motion.button>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="h-px bg-gray-100 mx-4" />
            <div className="px-4 py-3 space-y-3">
              {/* Existing comments */}
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <Image
                    src={comment.avatar}
                    alt={comment.author}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="bg-gray-50 rounded-xl px-3.5 py-2 flex-1">
                    <span className="text-xs font-semibold text-gray-800">
                      {comment.author}
                    </span>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {comment.text}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {comment.time}
                    </span>
                  </div>
                </div>
              ))}

              {/* Comment input */}
              <div className="flex items-center gap-2">
                <Image
                  src={globalAvatar || "/images/avatar.png"}
                  alt="You"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 flex items-center bg-gray-50 rounded-full border border-gray-200 overflow-hidden">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddComment();
                    }}
                    placeholder="Add a comment..."
                    className="flex-1 text-xs bg-transparent px-3.5 py-2 focus:outline-none text-gray-700 placeholder-gray-400"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className={`p-2 transition-colors ${
                      commentText.trim()
                        ? "text-teal-600 hover:text-teal-700"
                        : "text-gray-300"
                    }`}
                  >
                    <Send size={14} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}