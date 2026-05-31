"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";

import { authService } from "@/lib/api/services/auth.service";
import { sellersService } from "@/lib/api/services/sellers.service";
import { usersService } from "@/lib/api/services/users.service";
import { chatService } from "@/lib/api/services/chat.service";

import SellerHeader from "./components/SellerHeader";
import SellerStats from "./components/SellerStats";
import SellerAbout from "./components/SellerAbout";
import SellerTemplates from "./components/SellerTemplates";
import SellerReviews from "./components/SellerReviews";

interface SellerProfileViewProps {
  sellerId?: string;
  isOwnProfile?: boolean;
}

export default function SellerProfileView({
  sellerId,
  isOwnProfile = false,
}: SellerProfileViewProps) {
  const router = useRouter();
  const [seller, setSeller] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Relationship and counts
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  // Review status
  const [submittingReview, setSubmittingReview] = useState(false);

  // Toast status
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [activeTab, setActiveTab] = useState<"templates" | "reviews">("templates");
  const currentUser = authService.getStoredUser();

  const fireToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        let activeId = sellerId;
        const storedUser = authService.getStoredUser();

        // Optimistic UI for own profile
        if (isOwnProfile && storedUser && storedUser.role === "seller") {
          setSeller(storedUser);
          setFollowersCount((storedUser as any).followersCount || 0);
        }

        if (!activeId) {
          activeId = storedUser?.id || (storedUser as any)?._id;
        }

        if (activeId) {
          // Fetch seller info
          const sellerData = await usersService.getUserById(activeId);
          setSeller(sellerData);
          setFollowersCount(
            (sellerData as any).followersCount ||
              (sellerData as any).followers?.length ||
              0
          );

          // Fetch relationship status if not own profile
          if (!isOwnProfile && currentUser) {
            try {
              const rel = await usersService.getRelationship(activeId);
              setIsFollowing(rel?.following || false);
            } catch (err) {
              console.warn("Failed to fetch relationship status", err);
            }
          }

          // Fetch dynamic templates
          const sellerTemplates = await sellersService.getSellerTemplates(activeId);
          setTemplates(sellerTemplates);

          // Fetch dynamic reviews
          const sellerReviews = await sellersService.getSellerReviews(activeId);
          setReviews(sellerReviews);
        }
      } catch (error) {
        console.error("Failed to load seller data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sellerId, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      fireToast("Please login to follow sellers!");
      return;
    }

    // Optimistic Update
    const previousFollowing = isFollowing;
    const previousCount = followersCount;

    setIsFollowing(!isFollowing);
    setFollowersCount((prev) => (isFollowing ? Math.max(0, prev - 1) : prev + 1));

    try {
      await usersService.toggleFollow(seller?.id || seller?._id);
      fireToast(isFollowing ? "Unfollowed store successfully" : "Following store now!");
    } catch (error) {
      console.error("Failed to toggle follow status", error);
      setIsFollowing(previousFollowing);
      setFollowersCount(previousCount);
      fireToast("Action failed, please try again.");
    }
  };

  const handleMessageSeller = async () => {
    if (!currentUser) {
      fireToast("Please login to message stores!");
      return;
    }
    try {
      const targetId = seller?.id || seller?._id;
      // Fixed from deprecated startConversation to startChat
      await chatService.startChat(targetId);
      router.push("/dashboard/messages");
    } catch (error) {
      console.error("Failed to open conversation", error);
      fireToast("Failed to open chat with store.");
    }
  };

  const handleShareProfile = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      fireToast("Store link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!currentUser) {
      fireToast("Please login to write reviews!");
      return;
    }

    setSubmittingReview(true);
    try {
      const targetId = seller?.id || seller?._id;
      const response = await sellersService.addSellerReview(targetId, {
        rating,
        comment,
      });

      const freshReview = {
        ...response,
        userId: {
          name: currentUser.name || currentUser.username,
          username: currentUser.username,
          avatarUrl: currentUser.avatar || "/images/avatar.png",
        },
      };

      setReviews((prev) => [freshReview, ...prev]);

      // Update seller stats average on-the-fly
      setSeller((prev: any) => {
        const newCount = (prev.reviewsCount || 0) + 1;
        const newRatingVal =
          ((prev.ratings || 5) * (prev.reviewsCount || 0) + rating) / newCount;
        return {
          ...prev,
          reviewsCount: newCount,
          ratings: parseFloat(newRatingVal.toFixed(1)),
        };
      });

      fireToast("Review posted successfully! Thank you.");
    } catch (error) {
      console.error("Failed to submit review:", error);
      fireToast("Failed to post review. Please try again.");
      throw error;
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#103B40] border-t-transparent" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-gray-100 max-w-lg mx-auto mt-12 text-center shadow-lg">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4 animate-bounce" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Seller Store Not Found</h3>
        <p className="text-gray-500 mb-6">
          This seller profile could not be retrieved. It may have been deactivated or is currently offline.
        </p>
        <button
          onClick={() => router.push("/dashboard/marketplace")}
          className="bg-[#123E41] hover:bg-[#0d2c2e] text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const averageRating = seller.ratings || seller.rating || 5;

  return (
    <div className="w-full max-w-7xl mx-auto pb-16 px-4">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -50, opacity: 0, x: "-50%" }}
            animate={{ y: 20, opacity: 1, x: "-50%" }}
            exit={{ y: -50, opacity: 0, x: "-50%" }}
            className="fixed top-4 left-1/2 z-[9999] bg-teal-600 border border-teal-500 shadow-2xl text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 pointer-events-none"
          >
            <CheckCircle size={16} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Seller Hero Header */}
      <SellerHeader
        seller={seller}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        followersCount={followersCount}
        onFollowToggle={handleFollowToggle}
        onMessageClick={handleMessageSeller}
        onShareClick={handleShareProfile}
      />

      {/* Stats Dashboard Grid */}
      <SellerStats
        seller={seller}
        followersCount={followersCount}
        templatesCount={templates.length}
        reviewsCount={reviews.length}
      />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Metadata/About) */}
        <div className="lg:col-span-1">
          <SellerAbout seller={seller} />
        </div>

        {/* Right Columns (Tabs Menu) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-2 border border-gray-100 shadow-sm flex gap-2">
            <button
              onClick={() => setActiveTab("templates")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === "templates"
                  ? "bg-[#123E41] text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              Templates ({templates.length})
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === "reviews"
                  ? "bg-[#123E41] text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {/* Active Tab rendering */}
          <div className="space-y-6">
            {activeTab === "templates" ? (
              <SellerTemplates templates={templates} />
            ) : (
              <SellerReviews
                reviews={reviews}
                averageRating={averageRating}
                isOwnProfile={isOwnProfile}
                currentUser={currentUser}
                submittingReview={submittingReview}
                onReviewSubmit={handleReviewSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
