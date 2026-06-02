"use client";

import { use, Suspense } from "react";
import SellerProfileView from "@/components/features/sellers/SellerProfileView";

export default function OtherSellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<div className="h-[200px] w-full animate-spin border-t-2 border-teal-600 rounded-full w-10 h-10 mx-auto mt-20" />}>
      <SellerProfileView sellerId={resolvedParams.id} isOwnProfile={false} />
    </Suspense>
  );
}
