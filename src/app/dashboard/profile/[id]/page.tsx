"use client";

import { use, Suspense } from "react";
import ProfileView from "@/components/features/profile/ProfileView";

export default function OtherProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<div className="h-[200px] w-full animate-pulse bg-gray-100 rounded-xl" />}>
      <ProfileView userId={resolvedParams.id} isOwnProfile={false} />
    </Suspense>
  );
}
