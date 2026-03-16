"use client";

import { Star } from "lucide-react";

export default function ReviewList() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-gray-900">Reviews</h3>
        <button className="text-sm font-semibold text-gray-900 underline">View All</button>
      </div>
      
      <div className="space-y-6">
        {[
          { name: "Sara", time: "2 days ago", comment: "Amazing template! Very professional and easy to customize. Helped me close my biggest client." },
          { name: "William", time: "1 week ago", comment: "Great value for money. Clean design and well organized slides." }
        ].map((review, idx) => (
          <div key={idx} className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0"></div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm text-gray-900">{review.name}</p>
                <div className="flex items-center">
                   {[1, 2, 3, 4, 5].map(star => <Star key={star} size={12} className="text-amber-400 fill-amber-400" />)}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{review.comment}</p>
              <p className="text-xs text-gray-400">{review.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
