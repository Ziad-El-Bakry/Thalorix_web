"use client";

import { Suspense } from "react";
import SellerProfileView from "@/components/features/sellers/SellerProfileView";

export default function MySellerProfilePage() {
  return (
    <Suspense fallback={<div className="h-[200px] w-full animate-spin border-t-2 border-teal-600 rounded-full w-10 h-10 mx-auto mt-20" />}>
      <SellerProfileView isOwnProfile={true} />
    </Suspense>
  );
}
