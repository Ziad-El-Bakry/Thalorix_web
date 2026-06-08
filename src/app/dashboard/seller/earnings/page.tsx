"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, User } from "@/lib/api/services/auth.service";
import SellerEarnings from "@/components/features/sellers/components/SellerEarnings";

export default function SellerEarningsPage() {
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
    <div className="w-full max-w-[1600px] mx-auto pb-12 relative min-h-[60vh]">
      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-[6px] rounded-2xl">
        <div className="bg-white px-8 py-8 rounded-2xl shadow-xl border border-gray-100 text-center max-w-md mx-4 transform transition-all">
          <div className="w-16 h-16 bg-[#103B40]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#103B40]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-500 text-sm">We're working hard to bring you a comprehensive earnings dashboard in our next update. Stay tuned!</p>
        </div>
      </div>

      {/* Blurred Content */}
      <div className="pointer-events-none select-none opacity-40">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Earnings & Payouts</h1>
          <p className="text-sm text-gray-500 mt-1">Track your revenue and request payouts</p>
        </div>
        
        <Suspense fallback={<div className="h-[400px] w-full animate-pulse bg-gray-100 rounded-2xl" />}>
          <SellerEarnings user={user} />
        </Suspense>
      </div>
    </div>
  );
}
