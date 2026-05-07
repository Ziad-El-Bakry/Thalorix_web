"use client";

import { Suspense } from "react";
import ProfileView from "@/components/features/profile/ProfileView";

export default function MyProfilePage() {
  return (
    <Suspense fallback={<div className="h-[200px] w-full animate-pulse bg-gray-100 rounded-xl" />}>
      <ProfileView isOwnProfile={true} />
    </Suspense>
  );
}