"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, User } from "@/lib/api/services/auth.service";
import PostsTab from "@/components/features/admin/PostsTab";
import ProductsTab from "@/components/features/admin/ProductsTab";

export default function AdminContentPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "products">("posts");

  useEffect(() => {
    const user = authService.getStoredUser();
    if (!user || user.role !== "admin") {
      router.push("/dashboard");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#103B40] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
        <p className="text-sm text-gray-500 mt-1">Review flagged posts and pending products</p>
      </div>

      <div className="bg-white rounded-2xl p-2 border border-gray-100 shadow-sm flex gap-2 mb-6 max-w-sm">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === "posts"
              ? "bg-[#103B40] text-white shadow-md"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          Community Posts
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === "products"
              ? "bg-[#103B40] text-white shadow-md"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          Marketplace Products
        </button>
      </div>
      
      <Suspense fallback={<div className="h-[400px] w-full animate-pulse bg-gray-100 rounded-2xl" />}>
        {activeTab === "posts" ? <PostsTab /> : <ProductsTab />}
      </Suspense>
    </div>
  );
}
