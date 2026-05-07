"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Pencil, Star, Eye, EyeOff, Trash2, Check, Heart, MessageCircle } from "lucide-react";
import { mockPosts, AdminPost } from "./adminMockData";
import EditPostModal from "./EditPostModal";

type Filter = "All" | "Published" | "Draft" | "Flagged" | "Hidden";

const statusColors: Record<AdminPost["status"], { bg: string; text: string; dot: string }> = {
  Published: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
  Draft: { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
  Flagged: { bg: "bg-red-50", text: "text-red-500", dot: "bg-red-500" },
  Hidden: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
};

export default function PostsTab() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [posts, setPosts] = useState(mockPosts);
  const [editingPost, setEditingPost] = useState<AdminPost | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filters: Filter[] = ["All", "Published", "Draft", "Flagged", "Hidden"];

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesFilter = filter === "All" || p.status === filter;
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.author.name.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [posts, filter, search]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = (updated: AdminPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast("Post updated successfully");
  };

  const handleApprove = (id: string) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Published" as const } : p)));
    showToast("Post approved");
  };

  const handleToggleFeatured = (id: string) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)));
  };

  const handleToggleHidden = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: (p.status === "Hidden" ? "Published" : "Hidden") as AdminPost["status"] } : p
      )
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      showToast("Post deleted");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search + Filters */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts or authors..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#103B40]/20 focus:border-[#103B40] transition-all"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  filter === f
                    ? "bg-[#103B40] text-white border-[#103B40]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
              >
                {f}
              </button>
            ))}
            <span className="text-xs text-gray-400 font-medium ml-1">{filteredPosts.length}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Post</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Author</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Category</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Engagement</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => {
              const sc = statusColors[post.status];
              return (
                <motion.tr
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                >
                  {/* Post */}
                  <td className="px-5 py-4 max-w-[250px]">
                    <div className="flex items-center gap-2">
                      {post.featured && <Star size={14} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{post.title}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{post.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  {/* Author */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ backgroundColor: post.author.color }}
                      >
                        {post.author.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 whitespace-nowrap">{post.author.name}</p>
                        <p className="text-[11px] text-gray-400">{post.author.role}</p>
                      </div>
                    </div>
                  </td>
                  {/* Category */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span
                      className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider"
                      style={{ backgroundColor: post.categoryColor }}
                    >
                      {post.category}
                    </span>
                  </td>
                  {/* Date */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-500 whitespace-nowrap">{post.date}</span>
                  </td>
                  {/* Engagement */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Heart size={13} className="text-red-400" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={13} className="text-gray-400" /> {post.comments}
                      </span>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {post.status}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingPost(post)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#103B40] bg-[#103B40]/5 hover:bg-[#103B40]/10 transition-colors flex items-center gap-1"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      {post.status === "Flagged" && (
                        <button
                          onClick={() => handleApprove(post.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                        >
                          <Check size={12} /> Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleFeatured(post.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          post.featured ? "text-amber-500 bg-amber-50" : "text-gray-400 hover:bg-gray-100"
                        }`}
                        title={post.featured ? "Unfeature" : "Feature"}
                      >
                        <Star size={14} className={post.featured ? "fill-amber-400" : ""} />
                      </button>
                      <button
                        onClick={() => handleToggleHidden(post.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                        title={post.status === "Hidden" ? "Unhide" : "Hide"}
                      >
                        {post.status === "Hidden" ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No posts found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditPostModal post={editingPost} isOpen={!!editingPost} onClose={() => setEditingPost(null)} onSave={handleSave} />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 right-6 bg-[#103B40] text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-[200] flex items-center gap-2"
          >
            <Check size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
