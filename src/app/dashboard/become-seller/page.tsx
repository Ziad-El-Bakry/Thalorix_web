"use client";

import { Suspense } from "react";
import BecomeSeller from "@/components/features/profile/components/BecomeSeller";

export default function BecomeSellerPage() {
  return (
    <div className="w-full max-w-[1200px] mx-auto pb-12">
      <Suspense fallback={<div className="h-[400px] w-full animate-pulse bg-gray-100 rounded-2xl" />}>
        <BecomeSeller />
      </Suspense>
    </div>
  );
}
