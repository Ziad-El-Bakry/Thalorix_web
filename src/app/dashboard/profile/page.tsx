"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api/services/auth.service";
import ProfileView from "@/components/features/profile/ProfileView";

export default function MyProfilePage() {
  const router = useRouter();

  useEffect(() => {
    const user = authService.getStoredUser();
    if (user?.role === "seller") {
      router.replace("/dashboard/seller/profile");
    }
  }, [router]);

  return (
    <Suspense fallback={<div className="h-[200px] w-full animate-pulse bg-gray-100 rounded-xl" />}>
      <ProfileView isOwnProfile={true} />
    </Suspense>
  );
}