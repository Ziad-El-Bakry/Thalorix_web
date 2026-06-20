"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Send, Check, Link2, Smile, X, Maximize2 } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAvatar } from "@/store/useAvatarStore";
import { authService } from "@/lib/api/services/auth.service";
import { usePostStore } from "@/store/usePostStore";
import { communityService } from "@/lib/api/services/community.service";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export interface PostData {
  id: string;
  author: {
    id?: string;
    name: string;
    avatar: string;
    title?: string;
  };
  content: string;
  image?: string;
  link?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  liked?: boolean;
  isUploading?: boolean;
  uploadProgress?: number;
  uploadError?: string;
  localMediaBlob?: string;
  localMediaFile?: any;
  localMediaType?: string;
  createdAt?: string;
  updatedAt?: string;
}

// individual comment
interface CommentData {
  id: string;
  author: string;
  authorId?: string;
  avatar: string;
  text: string;
  time: string;
}

export default function PostCard({ post }: { post: PostData }) {
  const [commentCount, setCommentCount] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [commentsAnimatedOpen, setCommentsAnimatedOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const { avatar: globalAvatar } = useAvatar();

  const currentUser = authService.getStoredUser();
  const currentUserName = currentUser?.name || currentUser?.username || "User";
  const currentUserId = currentUser?.id || (currentUser as any)?._id || 'guest';
  
  // Ensure we match either by explicit ID or by exact Name
  const isPostOwner = (currentUserId && post.author.id === currentUserId) || (post.author.name === currentUserName && post.author.name !== "Unknown User");
  const isSeller = currentUser?.role === "seller";
  const myProfilePath = isSeller ? "/dashboard/seller/profile" : "/dashboard/profile";

  const { deletePost, editPost, toggleLike, retryPost } = usePostStore();
  const [isPostDropdownOpen, setIsPostDropdownOpen] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostContent, setEditPostContent] = useState(post.content);

  const [openCommentDropdownId, setOpenCommentDropdownId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  // Interactors Modal State
  const [isInteractorsModalOpen, setIsInteractorsModalOpen] = useState(false);
  const [interactorsTab, setInteractorsTab] = useState<"likes" | "comments">("likes");
  const [interactorsLoading, setInteractorsLoading] = useState(false);
  const [likedUsers, setLikedUsers] = useState<any[]>([]);

  const openInteractorsModal = async (tab: "likes" | "comments") => {
    setInteractorsTab(tab);
    setIsInteractorsModalOpen(true);
    setInteractorsLoading(true);
    try {
      if (tab === "likes") {
        const data = await communityService.getLikes(post.id);
        setLikedUsers(data);
      } else {
        const data = await communityService.getComments(post.id);
        setComments(data.map((c: any) => ({
          id: c._id,
          author: c.userId?.name || c.userId?.username || "User",
          authorId: c.userId?._id || c.userId?.id,
          avatar: c.userId?.avatarUrl || c.userId?.avatar || c.userId?.logo || "/images/avatar.png",
          text: c.content,
          time: dayjs(c.createdAt).fromNow(),
        })));
      }
    } catch (error) {
      console.error("Failed to load interactors:", error);
    } finally {
      setInteractorsLoading(false);
    }
  };

  const handleTabChange = async (tab: "likes" | "comments") => {
    setInteractorsTab(tab);
    setInteractorsLoading(true);
    try {
      if (tab === "likes") {
        const data = await communityService.getLikes(post.id);
        setLikedUsers(data);
      } else {
        const data = await communityService.getComments(post.id);
        setComments(data.map((c: any) => ({
          id: c._id,
          author: c.userId?.name || c.userId?.username || "User",
          authorId: c.userId?._id || c.userId?.id,
          avatar: c.userId?.avatarUrl || c.userId?.avatar || c.userId?.logo || "/images/avatar.png",
          text: c.content,
          time: dayjs(c.createdAt).fromNow(),
        })));
      }
    } catch (error) {
      console.error("Failed to load interactors:", error);
    } finally {
      setInteractorsLoading(false);
    }
  };

  const CONTENT_LIMIT = 200;
  const LINE_LIMIT = 4;
  const lines = post.content ? post.content.split('\n') : [];
  const isLongContent = (post.content && post.content.length > CONTENT_LIMIT) || lines.length > LINE_LIMIT;

  const getTruncatedContent = () => {
    if (!isLongContent || showMore) return post.content;
    let truncated = post.content;
    if (lines.length > LINE_LIMIT) {
      truncated = lines.slice(0, LINE_LIMIT).join('\n');
    }
    if (truncated.length > CONTENT_LIMIT) {
      truncated = truncated.slice(0, CONTENT_LIMIT);
    }
    return truncated + "...";
  };

  const handleLike = () => {
    if (currentUserId) {
      toggleLike(post.id, currentUserId);
    }
  };

  const handleShowComments = async () => {
    const newShow = !showComments;
    setShowComments(newShow);
    if (!newShow) {
      setShowEmojiPicker(false);
      setCommentsAnimatedOpen(false);
    }
    if (newShow && comments.length === 0 && commentCount > 0) {
      setCommentsLoading(true);
      try {
        const data = await communityService.getComments(post.id);
        setComments(data.map((c: any) => ({
          id: c._id,
          author: c.userId?.name || c.userId?.username || "User",
          authorId: c.userId?._id || c.userId?.id,
          avatar: c.userId?.avatarUrl || c.userId?.avatar || c.userId?.logo || "/images/avatar.png",
          text: c.content,
          time: dayjs(c.createdAt).fromNow(),
        })));
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setCommentsLoading(false);
      }
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    try {
      const c = await communityService.addComment(post.id, commentText);
      const newComment: CommentData = {
        id: c._id || `temp_${Date.now()}`,
        author: c.userId?.name || currentUserName,
        authorId: c.userId?._id || c.userId?.id || currentUser?.id,
        avatar: c.userId?.avatarUrl || c.userId?.avatar || c.userId?.logo || globalAvatar || "/images/avatar.png",
        text: c.content || commentText,
        time: "Just now",
      };
      setComments((prev) => [newComment, ...prev]);
      setCommentCount((prev) => prev + 1);
      setCommentText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleShare = async () => {
    try {
      const postUrl = `${window.location.origin}/dashboard/community#post-${post.id}`;
      await navigator.clipboard.writeText(postUrl);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <motion.div
      id={`post-${post.id}`}
      initial={post.id.startsWith("temp_") ? { opacity: 0, scale: 0.95 } : { opacity: 0, y: 15 }}
      animate={post.id.startsWith("temp_") ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
        post.uploadError ? "border-red-200" : "border-gray-100"
      }`}
    >
      {/* Author row */}
      <div className="flex items-start justify-between px-4 pt-4 pb-2">
        <Link 
          href={post.author.id ? (isPostOwner ? myProfilePath : `/dashboard/profile/${post.author.id}`) : "#"} 
          className="flex flex-1 items-center gap-3 group"
        >
          <Image
            src={isPostOwner ? (globalAvatar || "/images/avatar.png") : (post.author.avatar || "/images/avatar.png")}
            alt={post.author.name}
            width={44}
            height={44}
            className="w-10 h-10 rounded-full object-cover shadow-sm flex-shrink-0 group-hover:ring-2 ring-teal-500/50 transition-all"
          />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-teal-700 transition-colors">
              {post.author.name}
            </h4>
            {post.author.title && (
              <p className="text-xs text-gray-500 mt-0.5">{post.author.title}</p>
            )}
            <p className="text-[11px] text-gray-400 mt-0.5">{post.timestamp}</p>
          </div>
        </Link>
        <div className="relative">
          <button 
            onClick={() => setIsPostDropdownOpen(!isPostDropdownOpen)} 
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
          >
            <MoreHorizontal size={18} />
          </button>
          <AnimatePresence>
            {isPostDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden"
              >
                {isPostOwner ? (
                  <>
                    <button 
                      onClick={() => { setIsEditingPost(true); setIsPostDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Edit Post
                    </button>
                    <button 
                      onClick={() => deletePost(post.id)}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete Post
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => deletePost(post.id)}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Hide Post
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        {isEditingPost ? (
          <div className="space-y-2 mt-1">
            <textarea
              value={editPostContent}
              onChange={(e) => setEditPostContent(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-200 resize-none min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => { setIsEditingPost(false); setEditPostContent(post.content); }}
                className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  editPost(post.id, editPostContent);
                  setIsEditingPost(false);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {getTruncatedContent()}
            </p>
            {isLongContent && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-teal-600 hover:text-teal-700 text-xs font-semibold mt-1 transition-colors"
              >
                {showMore ? "Show less" : "See more"}
              </button>
            )}

            {post.link && (
              <div className="mt-3 flex">
                <a
                  href={post.link.startsWith("http") ? post.link : `https://${post.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50/50 hover:bg-teal-50 border border-teal-100/70 rounded-lg text-xs font-semibold text-teal-700 hover:text-teal-800 transition-all shadow-sm hover:shadow active:scale-[0.98]"
                >
                  <Link2 size={14} className="text-teal-500" />
                  <span>{post.link}</span>
                </a>
              </div>
            )}
          </>
        )}
      </div>

      {/* Media (Image or Video) */}
      {(post.image || post.localMediaBlob) && (
        <div className="border-t border-b border-gray-100 bg-black flex justify-center relative group/media overflow-hidden">
          {(post.image && (post.image.match(/\.(mp4|webm|ogg|mov)$/i) || post.image.includes('/video/upload/'))) || 
           (post.localMediaType && post.localMediaType.startsWith('video/')) ? (
            <video
              src={post.image || post.localMediaBlob}
              controls={!post.isUploading}
              className={`w-full max-h-[400px] object-contain ${post.isUploading ? 'opacity-40' : ''}`}
            />
          ) : (
            <img
              src={post.image || post.localMediaBlob}
              alt="Post media"
              onClick={() => !post.isUploading && setShowPreview(true)}
              className={`w-full max-h-[400px] object-cover cursor-zoom-in hover:opacity-95 transition-opacity ${post.isUploading ? 'opacity-40' : ''}`}
            />
          )}

          {/* Floating Expand/Preview Button */}
          {!post.isUploading && (
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-teal-600/90 text-white rounded-full transition-all duration-200 backdrop-blur-sm shadow-md hover:scale-105 active:scale-95 opacity-0 group-hover/media:opacity-100 focus:opacity-100 z-10 cursor-pointer"
              title="Preview media"
            >
              <Maximize2 size={14} />
            </button>
          )}

          {post.isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-3" />
              <div className="w-48 bg-white/20 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-teal-400 h-full transition-all duration-300"
                  style={{ width: `${post.uploadProgress || 0}%` }}
                />
              </div>
              <p className="text-white text-xs mt-2 font-medium">Uploading... {post.uploadProgress || 0}%</p>
            </div>
          )}

          {post.uploadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/60 backdrop-blur-sm z-10 p-4 text-center">
              <p className="text-white text-sm font-semibold mb-2">{post.uploadError}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => retryPost(post.id)}
                  className="px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-xs font-bold hover:bg-teal-200 transition-colors"
                >
                  Retry Upload
                </button>
                <button 
                  onClick={() => deletePost(post.id)}
                  className="px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-bold hover:bg-red-200 transition-colors"
                >
                  Discard Post
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats row */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500">
        <button 
          onClick={() => openInteractorsModal("likes")}
          className="flex items-center gap-1 hover:text-teal-600 hover:underline transition-colors cursor-pointer"
        >
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-500 text-white text-[10px]">
            👍
          </span>
          <span className="font-semibold">{post.likes}</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openInteractorsModal("comments")}
            className="hover:text-teal-600 hover:underline transition-colors cursor-pointer font-semibold"
          >
            {commentCount} comments
          </button>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-4" />

      {/* Action buttons */}
      <div className="flex items-center justify-around px-2 py-1 relative">
        {(post.isUploading || post.uploadError) && (
          <div className="absolute inset-0 bg-white/50 z-10 cursor-not-allowed" />
        )}
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={handleLike}
          className={`flex items-center gap-2 flex-1 justify-center py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50 ${
            post.liked ? "text-teal-600" : "text-gray-500"
          }`}
        >
          <ThumbsUp size={18} className={post.liked ? "fill-teal-600" : ""} />
          <span className="hidden sm:inline">Like</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={handleShowComments}
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
            onAnimationStart={() => {
              if (!showComments) setCommentsAnimatedOpen(false);
            }}
            onAnimationComplete={() => {
              if (showComments) setCommentsAnimatedOpen(true);
            }}
            className={commentsAnimatedOpen ? "overflow-visible" : "overflow-hidden"}
          >
            <div className="h-px bg-gray-100 mx-4" />
            <div className="px-4 py-3 space-y-3">
              {/* Existing comments */}
              {comments.map((comment) => {
                const commentIsOwner = (currentUserId && comment.authorId === currentUserId) || (comment.author === currentUserName && comment.author !== "Unknown User");
                const commentProfileHref = comment.authorId 
                  ? (commentIsOwner ? myProfilePath : `/dashboard/profile/${comment.authorId}`)
                  : "#";
                return (
                  <div key={comment.id} className="flex gap-2 group">
                    <Link href={commentProfileHref} className="shrink-0 hover:opacity-85 transition-opacity">
                      <Image
                        src={commentIsOwner ? (globalAvatar || "/images/avatar.png") : (comment.avatar || "/images/avatar.png")}
                        alt={comment.author}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <div className="bg-gray-50 rounded-xl px-3.5 py-2 flex-1 relative">
                          <Link href={commentProfileHref} className="hover:text-teal-700 hover:underline transition-colors block w-fit">
                            <span className="text-xs font-semibold text-gray-800 cursor-pointer">
                              {comment.author}
                            </span>
                          </Link>
                        
                        {editingCommentId === comment.id ? (
                          <div className="mt-1 space-y-2">
                            <input
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  setComments(comments.map(c => c.id === comment.id ? { ...c, text: editCommentText } : c));
                                  setEditingCommentId(null);
                                }
                              }}
                              autoFocus
                              className="w-full text-xs bg-white border border-gray-200 px-2 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-teal-200"
                            />
                            <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500">
                              <button onClick={() => setEditingCommentId(null)} className="hover:text-gray-700">Cancel</button>
                              <span>·</span>
                              <button 
                                onClick={async () => {
                                  try {
                                    await communityService.updateComment(comment.id, editCommentText);
                                    setComments(comments.map(c => c.id === comment.id ? { ...c, text: editCommentText } : c));
                                    setEditingCommentId(null);
                                  } catch(e) { console.error(e); }
                                }} 
                                className="text-teal-600 hover:text-teal-700"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs text-gray-600 mt-0.5 whitespace-pre-wrap">
                              {comment.text}
                            </p>
                            <span className="text-[10px] text-gray-400 mt-1 block">
                              {comment.time}
                            </span>
                          </>
                        )}
                      </div>
                      
                      {/* Comment Actions (Three dots) */}
                      <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setOpenCommentDropdownId(openCommentDropdownId === comment.id ? null : comment.id)}
                          className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        
                        <AnimatePresence>
                          {openCommentDropdownId === comment.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-full mt-1 w-24 bg-white border border-gray-100 rounded-lg shadow-lg z-20 overflow-hidden"
                            >
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(comment.text);
                                  setOpenCommentDropdownId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
                              >
                                Copy Text
                              </button>
                              {(comment.author === currentUserName || comment.author === currentUser?.username || comment.author === currentUser?.name) && (
                                <>
                                  <button 
                                    onClick={() => { 
                                      setEditingCommentId(comment.id); 
                                      setEditCommentText(comment.text);
                                      setOpenCommentDropdownId(null); 
                                    }}
                                    className="w-full text-left px-3 py-2 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={async () => {
                                      try {
                                        await communityService.deleteComment(comment.id);
                                        setComments(comments.filter(c => c.id !== comment.id));
                                        setCommentCount(prev => prev - 1);
                                        setOpenCommentDropdownId(null);
                                      } catch (e) { console.error(e); }
                                    }}
                                    className="w-full text-left px-3 py-2 text-[11px] font-semibold text-red-600 hover:bg-red-50"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              );})}

              {/* Comment input */}
              <div className="flex items-center gap-2 relative">
                <Image
                  src={globalAvatar || "/images/avatar.png"}
                  alt="You"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />

                {showEmojiPicker && (
                  <div className="absolute bottom-[calc(100%+8px)] left-0 sm:left-10 z-50 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-150 shadow-xl rounded-xl border border-gray-100">
                    <EmojiPicker
                      theme={Theme.LIGHT}
                      onEmojiClick={(emojiData) => setCommentText(prev => prev + emojiData.emoji)}
                      lazyLoadEmojis={true}
                      width={280}
                      height={350}
                      reactionsDefaultOpen={false}
                    />
                  </div>
                )}

                <div className="flex-1 flex items-center bg-gray-50 rounded-full border border-gray-200 overflow-hidden">
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="pl-3 py-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Smile size={16} />
                  </button>
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddComment();
                        setShowEmojiPicker(false);
                      }
                    }}
                    placeholder="Add a comment..."
                    className="flex-1 text-xs bg-transparent px-2.5 py-2 focus:outline-none text-gray-700 placeholder-gray-400"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      handleAddComment();
                      setShowEmojiPicker(false);
                    }}
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

      {/* Media Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreview(false)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[999] flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 text-white hover:text-teal-400 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all z-[1000] cursor-pointer"
            >
              <X size={20} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center cursor-default"
            >
              {((post.image && (post.image.match(/\.(mp4|webm|ogg|mov)$/i) || post.image.includes('/video/upload/'))) || 
               (post.localMediaType && post.localMediaType.startsWith('video/'))) ? (
                <video
                  src={post.image || post.localMediaBlob}
                  controls
                  autoPlay
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <img
                  src={post.image || post.localMediaBlob}
                  alt="Full preview"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl select-none"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactors Modal (Bubble Window) */}
      <AnimatePresence>
        {isInteractorsModalOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setIsInteractorsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[80vh] cursor-default text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Post Interactors</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Users who reacted or commented on this post</p>
                </div>
                <button
                  onClick={() => setIsInteractorsModalOpen(false)}
                  className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 px-4 bg-gray-50/50">
                <button
                  onClick={() => handleTabChange("likes")}
                  className={`flex-1 py-3.5 text-xs font-bold transition-all relative ${
                    interactorsTab === "likes" ? "text-teal-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    👍 Likes
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                      interactorsTab === "likes" ? "bg-teal-50 text-teal-600" : "bg-gray-200/60 text-gray-500"
                    }`}>
                      {post.likes}
                    </span>
                  </span>
                  {interactorsTab === "likes" && (
                    <motion.div 
                      layoutId="activeTabUnderline" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" 
                    />
                  )}
                </button>
                <button
                  onClick={() => handleTabChange("comments")}
                  className={`flex-1 py-3.5 text-xs font-bold transition-all relative ${
                    interactorsTab === "comments" ? "text-teal-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    💬 Comments
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                      interactorsTab === "comments" ? "bg-teal-50 text-teal-600" : "bg-gray-200/60 text-gray-500"
                    }`}>
                      {commentCount}
                    </span>
                  </span>
                  {interactorsTab === "comments" && (
                    <motion.div 
                      layoutId="activeTabUnderline" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" 
                    />
                  )}
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-4 min-h-[250px] max-h-[50vh]">
                {interactorsLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-gray-500 font-medium">Fetching interactors...</p>
                  </div>
                ) : interactorsTab === "likes" ? (
                  likedUsers.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-gray-400 text-sm">No likes yet on this post.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {likedUsers.map((like) => {
                        const isLikeOwner = currentUserId && like.user?.id === currentUserId;
                        const likeProfileHref = like.user?.id 
                          ? (isLikeOwner ? myProfilePath : `/dashboard/profile/${like.user.id}`)
                          : "#";

                        return (
                          <div key={like.id} className="flex items-center justify-between">
                            <Link 
                              href={likeProfileHref} 
                              onClick={() => setIsInteractorsModalOpen(false)}
                              className="flex items-center gap-3 hover:opacity-85 transition-opacity"
                            >
                              <Image
                                src={like.user?.avatar || "/images/avatar.png"}
                                alt={like.user?.name}
                                width={36}
                                height={36}
                                className="w-9 h-9 rounded-full object-cover shadow-sm"
                              />
                              <div>
                                <span className="text-sm font-semibold text-gray-900 block leading-tight">
                                  {like.user?.name}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {like.user?.role ? like.user.role.charAt(0).toUpperCase() + like.user.role.slice(1) : "Member"}
                                </span>
                              </div>
                            </Link>
                            
                            <span className="text-xs bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full font-bold border border-teal-100">
                              👍 Liked
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  comments.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-gray-400 text-sm">No comments yet on this post.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => {
                        const isCommentOwner = currentUserId && comment.authorId === currentUserId;
                        const commentProfileHref = comment.authorId 
                          ? (isCommentOwner ? myProfilePath : `/dashboard/profile/${comment.authorId}`)
                          : "#";

                        return (
                          <div key={comment.id} className="flex gap-3">
                            <Link 
                              href={commentProfileHref} 
                              onClick={() => setIsInteractorsModalOpen(false)}
                              className="shrink-0 hover:opacity-85 transition-opacity"
                            >
                              <Image
                                src={comment.avatar}
                                alt={comment.author}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            </Link>
                            <div className="flex-1 bg-gray-50 rounded-2xl px-3.5 py-2 text-left">
                              <div className="flex items-center justify-between">
                                <Link 
                                  href={commentProfileHref} 
                                  onClick={() => setIsInteractorsModalOpen(false)}
                                  className="hover:text-teal-700 hover:underline transition-colors"
                                >
                                  <span className="text-xs font-bold text-gray-800">
                                    {comment.author}
                                  </span>
                                </Link>
                                <span className="text-[9px] text-gray-400">{comment.time}</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">
                                {comment.text}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}