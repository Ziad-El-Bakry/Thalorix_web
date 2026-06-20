"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SellerDashboardContent from "@/components/features/dashboard/SellerDashboardContent";
import { authService, User } from "@/lib/api/services/auth.service";

export default function SellerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (!storedUser || storedUser.role !== "seller") {
      router.push("/dashboard");
    } else {
      setUser(storedUser);
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#103B40] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor your store performance and revenue</p>
      </div>
      
      <Suspense fallback={<div className="h-[200px] w-full animate-pulse bg-gray-100 rounded-2xl" />}>
        <SellerDashboardContent user={user} />
      </Suspense>
    </div>
  );
}
