"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  FolderTree,
  Loader2,
  AlertCircle,
  Tag,
} from "lucide-react";
import { categoriesService } from "@/lib/api/services/categories.service";
import { Category } from "@/types";

interface CategoryFormData {
  name: string;
  parentId?: string;
}

export default function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({ name: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ─── Fetch categories ───
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesService.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch categories:", err);
      setError(err?.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ─── Filtered list ───
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  // ─── Toast helper ───
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Open modal for create / edit ───
  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: "" });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, parentId: undefined });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "" });
    setFormError(null);
  };

  // ─── Submit create / update ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      setFormError("Category name is required");
      return;
    }
    if (trimmedName.length < 2) {
      setFormError("Name must be at least 2 characters");
      return;
    }
    if (trimmedName.length > 80) {
      setFormError("Name must be at most 80 characters");
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      if (editingCategory) {
        await categoriesService.update(editingCategory._id || editingCategory.id!, {
          name: trimmedName,
        });
        showToast("Category updated successfully");
      } else {
        await categoriesService.create({ name: trimmedName });
        showToast("Category created successfully");
      }

      closeModal();
      await fetchCategories();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (editingCategory ? "Failed to update category" : "Failed to create category");
      setFormError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete ───
  const handleDelete = async (id: string) => {
    try {
      await categoriesService.delete(id);
      showToast("Category deleted successfully");
      setDeletingId(null);
      await fetchCategories();
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to delete category",
        "error"
      );
      setDeletingId(null);
    }
  };

  // ─── Format date ───
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ═══════════════════════════════════════
  // Render
  // ═══════════════════════════════════════
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header: Search + Add Button */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#103B40]/20 focus:border-[#103B40] transition-all"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#103B40] text-white rounded-xl text-sm font-semibold hover:bg-[#1b5c63] transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Category
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-gray-400 font-medium">
            {filteredCategories.length} categor{filteredCategories.length === 1 ? "y" : "ies"}
          </span>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="text-[#103B40] animate-spin" />
          <span className="ml-3 text-sm text-gray-500">Loading categories...</span>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <AlertCircle size={32} className="text-red-400" />
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={fetchCategories}
            className="px-4 py-2 text-xs font-semibold text-[#103B40] bg-[#103B40]/10 rounded-lg hover:bg-[#103B40]/20 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Created
                </th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  Updated
                </th>
                <th className="text-right px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredCategories.map((category) => {
                  const catId = category._id || category.id || "";
                  return (
                    <motion.tr
                      key={catId}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                    >
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#103B40]/10 to-[#103B40]/5 flex items-center justify-center">
                            <Tag size={16} className="text-[#103B40]" />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {category.name}
                          </span>
                        </div>
                      </td>
                      {/* Created */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-sm text-gray-500">
                          {formatDate(category.createdAt)}
                        </span>
                      </td>
                      {/* Updated */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-sm text-gray-500">
                          {formatDate(category.updatedAt)}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {deletingId === catId ? (
                            <>
                              <span className="text-xs text-red-500 font-medium mr-1">
                                Delete?
                              </span>
                              <button
                                onClick={() => handleDelete(catId)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-1"
                              >
                                <Check size={12} /> Yes
                              </button>
                              <button
                                onClick={() => setDeletingId(null)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-1"
                              >
                                <X size={12} /> No
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => openEditModal(category)}
                                className="p-2 rounded-lg text-gray-400 hover:bg-[#103B40]/10 hover:text-[#103B40] transition-colors"
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => setDeletingId(catId)}
                                className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <FolderTree size={40} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">
                {search ? "No categories match your search." : "No categories yet. Create one to get started."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── Create / Edit Modal ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#103B40]/10 flex items-center justify-center">
                    <Tag size={20} className="text-[#103B40]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {editingCategory ? "Edit Category" : "New Category"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {editingCategory
                        ? "Update the category details"
                        : "Create a new marketplace category"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Name field */}
                <div>
                  <label className="block text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. Web Templates, UI Kits..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#103B40]/20 focus:border-[#103B40] transition-all placeholder:text-gray-300"
                    autoFocus
                    maxLength={80}
                  />
                  <p className="text-[11px] text-gray-300 mt-1.5 text-right">
                    {formData.name.length}/80
                  </p>
                </div>

                {/* Parent category dropdown */}
                {categories.length > 0 && (
                  <div>
                    <label className="block text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                      Parent Category{" "}
                      <span className="text-gray-300 font-normal normal-case">(optional)</span>
                    </label>
                    <select
                      value={formData.parentId || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          parentId: e.target.value || undefined,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#103B40]/20 focus:border-[#103B40] transition-all bg-white text-gray-700"
                    >
                      <option value="">None (Top-level)</option>
                      {categories
                        .filter(
                          (c) =>
                            (c._id || c.id) !== (editingCategory?._id || editingCategory?.id)
                        )
                        .map((c) => (
                          <option key={c._id || c.id} value={c._id || c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Error */}
                <AnimatePresence>
                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium"
                    >
                      <AlertCircle size={14} />
                      {formError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-[#103B40] text-white rounded-xl text-sm font-bold hover:bg-[#1b5c63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    {editingCategory ? "Save Changes" : "Create Category"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Toast ─── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-[200] flex items-center gap-2 ${
              toast.type === "success"
                ? "bg-[#103B40] text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
