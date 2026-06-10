"use client";

import { CheckCircle2, Circle } from "lucide-react";

export default function ProfileScore() {
  const score = 82;
  const dashArray = 2 * Math.PI * 36; // 36 is r
  const dashOffset = dashArray - (dashArray * score) / 100;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase">Profile Score</h3>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Large Circular Progress */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
            <circle 
              cx="40" cy="40" r="36" 
              fill="none" 
              stroke="#f3f4f6"
              className="dark:stroke-gray-700" 
              strokeWidth="6" 
            />
            <circle 
              cx="40" cy="40" r="36" 
              fill="none" 
              stroke="#43B0B5" 
              strokeWidth="6" 
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#103B40] dark:text-[#43B0B5] leading-none">{score}</span>
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">/ 100</span>
          </div>
        </div>

        {/* Checklist */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#103B40]" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Skills</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#103B40]" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Cover photo</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle size={16} className="text-gray-300" />
            <span className="text-sm text-gray-400 dark:text-gray-500">Portfolio</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle size={16} className="text-gray-300" />
            <span className="text-sm text-gray-400 dark:text-gray-500">Recommendations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
