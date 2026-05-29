"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Send, Check } from "lucide-react";
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
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<CommentData[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const { avatar: globalAvatar } = useAvatar();

  const currentUser = authService.getStoredUser();
  const currentUserName = currentUser?.name || currentUser?.username || "User";
  const isPostOwner = post.author.name === currentUserName || (currentUser?.id && post.author.id === currentUser.id);

  const { deletePost, editPost } = usePostStore();
  const [isPostDropdownOpen, setIsPostDropdownOpen] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostContent, setEditPostContent] = useState(post.content);

  const [openCommentDropdownId, setOpenCommentDropdownId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  const CONTENT_LIMIT = 200;
  const isLongContent = post.content.length > CONTENT_LIMIT;

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleShowComments = async () => {
    const newShow = !showComments;
    setShowComments(newShow);
    if (newShow && comments.length === 0 && commentCount > 0) {
      setCommentsLoading(true);
      try {
        const data = await communityService.getComments(post.id);
        setComments(data.map((c: any) => ({
          id: c._id,
          author: c.userId?.name || c.userId?.username || "User",
          avatar: c.userId?.avatarUrl || "/images/avatar.png",
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
        id: c._id,
        author: c.userId?.name || currentUserName,
        avatar: c.userId?.avatarUrl || globalAvatar || "/images/avatar.png",
        text: c.content,
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
        <Link href={post.author.id ? `/dashboard/profile/${post.author.id}` : "#"} className="flex flex-1 items-center gap-3 group">
          <Image
            src={post.author.avatar}
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
          </>
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
            onClick={handleShowComments}
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
            className="overflow-hidden"
          >
            <div className="h-px bg-gray-100 mx-4" />
            <div className="px-4 py-3 space-y-3">
              {/* Existing comments */}
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2 group">
                  <Image
                    src={comment.avatar}
                    alt={comment.author}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <div className="bg-gray-50 rounded-xl px-3.5 py-2 flex-1 relative">
                        <span className="text-xs font-semibold text-gray-800">
                          {comment.author}
                        </span>
                        
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