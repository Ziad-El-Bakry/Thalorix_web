"use client";

import { Star } from "lucide-react";

export default function ReviewList() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-gray-900">Reviews</h3>
      </div>
      
      <div className="space-y-6">
        <p className="text-sm text-gray-500">No reviews yet.</p>
      </div>
    </div>
  );
}
