"use client";

import { use } from "react";
import ProfileView from "@/components/features/profile/ProfileView";

export default function OtherProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <ProfileView userId={resolvedParams.id} isOwnProfile={false} />;
}
