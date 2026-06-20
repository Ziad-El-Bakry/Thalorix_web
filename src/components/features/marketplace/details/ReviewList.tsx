"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, Send } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TemplateReview } from "@/types";
import { templatesService } from "@/lib/api/services/templates.service";
import { authService } from "@/lib/api/services/auth.service";

dayjs.extend(relativeTime);

interface ReviewListProps {
  templateId: string;
}

export default function ReviewList({ templateId }: ReviewListProps) {
  const [reviews, setReviews] = useState<TemplateReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const currentUser = authService.getStoredUser();

  useEffect(() => {
    fetchReviews();
  }, [templateId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await templatesService.getReviews(templateId);
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingDistribution[r.rating - 1]++;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!newComment.trim()) {
      setValidationError("Review comment cannot be empty!");
      return;
    }

    try {
      setSubmittingReview(true);
      await templatesService.addReview(templateId, newRating, newComment);
      setNewComment("");
      setNewRating(5);
      await fetchReviews(); // Refresh the reviews list
    } catch (err: any) {
      setValidationError(err.response?.data?.message || err.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500 animate-pulse">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Rating Distribution Graph */}
      {reviews.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-6">Customer Ratings Summary</h4>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-center shrink-0 py-4 px-6 bg-slate-50 rounded-2xl border border-slate-100/50">
              <p className="text-5xl font-black text-[#123E41] tracking-tighter">{averageRating}</p>
              <div className="flex items-center gap-0.5 justify-center mt-2 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= Math.round(Number(averageRating))
                        ? "fill-amber-400 text-amber-500"
                        : "text-slate-200"
                    }
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 font-semibold">{reviews.length} Template reviews</p>
            </div>

            <div className="flex-1 w-full space-y-2.5">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingDistribution[stars - 1] || 0;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                    <span className="w-3 text-right">{stars}</span>
                    <Star size={12} className="fill-amber-400 text-amber-500" />
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-gray-400">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Write a review form */}
      {currentUser && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h4 className="text-lg font-bold text-slate-800 border-b pb-2 border-gray-100">Write a Review</h4>
          
          {validationError && (
            <p className="text-xs font-bold text-red-500">{validationError}</p>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">Your Rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="hover:scale-110 active:scale-95 transition-transform"
                >
                  <Star
                    size={22}
                    className={
                      star <= newRating
                        ? "fill-amber-400 text-amber-500"
                        : "text-slate-200"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Your Feedback</label>
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tell us what you think about this template..."
              className="w-full border border-gray-200 rounded-xl p-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-200 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submittingReview}
              className="flex items-center gap-2 bg-[#123E41] hover:bg-[#0d2c2e] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              {submittingReview ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Send size={14} />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      )}
      
      {!currentUser && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 text-center">
          Please log in to leave a review for this template.
        </div>
      )}

      {/* Reviews Feed */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {(showAll ? reviews : reviews.slice(0, 3)).map((rev) => (
            <motion.div
              key={rev._id || rev.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shadow-sm flex items-center justify-center shrink-0 border border-gray-200">
                    <img
                      src={rev.userId?.avatarUrl || rev.userId?.avatar || rev.userId?.logo || "/images/avatar.png"}
                      alt={rev.userId?.name || "Customer"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-slate-800">{rev.userId?.name || "Customer"}</p>
                    <p className="text-[10px] text-gray-400 font-medium">@{rev.userId?.username || "customer"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-0.5 justify-end">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={12}
                        className={
                          star <= rev.rating
                            ? "fill-amber-400 text-amber-500"
                            : "text-slate-200"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block font-medium">
                    {rev.createdAt ? dayjs(rev.createdAt).fromNow() : "Recently"}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pl-1 sm:pl-13 whitespace-pre-line">
                {rev.comment}
              </p>
            </motion.div>
          ))}
          {reviews.length > 3 && (
            <div className="flex justify-center mt-4 pt-2">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-teal-600 hover:text-teal-700 text-sm font-bold border border-teal-100 bg-teal-50 hover:bg-teal-100 px-6 py-2.5 rounded-full transition-all active:scale-95 shadow-sm"
              >
                {showAll ? "See Less" : "See More Reviews"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white py-16 text-center rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mx-auto mb-4">
            <MessageSquare size={24} />
          </div>
          <h4 className="text-lg font-bold text-gray-900 mb-1">No Reviews Yet</h4>
          <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
            This template has not received any reviews yet. Be the first to leave your feedback!
          </p>
        </div>
      )}
    </div>
  );
}
