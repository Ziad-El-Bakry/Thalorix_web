"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil, Heart, MessageCircle } from "lucide-react";
import type { AdminPost } from "./adminMockData";

interface EditPostModalProps {
  post: AdminPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: AdminPost) => void;
}

export default function EditPostModal({ post, isOpen, onClose, onSave }: EditPostModalProps) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState<AdminPost["status"]>("Draft");
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setExcerpt(post.excerpt);
      setStatus(post.status);
      setFeatured(post.featured);
    }
  }, [post]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleSave = () => {
    if (!post) return;
    onSave({ ...post, title, excerpt, status, featured });
    onClose();
  };

  const hasChanges = post && (title !== post.title || excerpt !== post.excerpt || status !== post.status || featured !== post.featured);

  return (
    <AnimatePresence>
      {isOpen && post && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#103B40] px-6 py-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Pencil size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/60 font-medium uppercase tracking-wider">Editing Post</p>
                  <h3 className="text-white font-semibold text-sm mt-0.5 line-clamp-1">{post.title}</h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            {/* Author info */}
            <div className="px-6 pt-4 flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                style={{ backgroundColor: post.author.color }}
              >
                {post.author.initials}
              </div>
              <span className="text-xs text-gray-500">
                by {post.author.name} · {post.date}
              </span>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Post Title <span className="text-red-500">*</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#103B40]/20 focus:border-[#103B40] transition-all"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Excerpt / Summary
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#103B40]/20 focus:border-[#103B40] transition-all resize-none"
                  placeholder="Brief excerpt shown in listings"
                />
              </div>

              {/* Status & Stats row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AdminPost["status"])}
                    className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#103B40]/20 focus:border-[#103B40] transition-all bg-white"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Flagged">Flagged</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Stats</label>
                  <div className="mt-1.5 flex items-center gap-4 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50">
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Heart size={14} className="text-red-400" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <MessageCircle size={14} className="text-gray-400" /> {post.comments}
                    </span>
                  </div>
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Featured Post</p>
                  <p className="text-xs text-gray-400 mt-0.5">Pinned at the top of the feed</p>
                </div>
                <button
                  onClick={() => setFeatured(!featured)}
                  className="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
                  style={{ backgroundColor: featured ? "#103B40" : "#d1d5db" }}
                  role="switch"
                  aria-checked={featured}
                  aria-label="Toggle featured post"
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    animate={{ left: featured ? 24 : 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                style={{
                  backgroundColor: hasChanges ? "#103B40" : "#6b7280",
                }}
              >
                {hasChanges ? "✓ Save Changes" : "✓ No Changes"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
