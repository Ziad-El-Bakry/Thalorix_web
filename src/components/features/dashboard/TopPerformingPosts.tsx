"use client";

import { Eye, Heart } from "lucide-react";

interface PostItemProps {
  rank: number;
  title: string;
  views: string;
  likes: string;
  ctr: string;
}

function PostItem({ rank, title, views, likes, ctr }: PostItemProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors px-2 rounded-lg cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-[#103B40]/10 dark:bg-[#43B0B5]/15 flex items-center justify-center text-[#103B40] dark:text-[#43B0B5] font-bold text-sm shrink-0">
          {rank}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{title}</h4>
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1"><Eye size={12} /> {views}</span>
            <span className="flex items-center gap-1"><Heart size={12} /> {likes}</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs font-semibold shrink-0">
        {ctr}
      </div>
    </div>
  );
}

export default function TopPerformingPosts() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase">Top Performing Posts</h3>
      </div>
      
      <div className="flex-1 flex flex-col">
        <PostItem 
          rank={1}
          title="Benchmarking 10M req/day system"
          views="12k"
          likes="566"
          ctr="8.4%"
        />
        <PostItem 
          rank={2}
          title="Migration across 2 countries"
          views="9.3k"
          likes="421"
          ctr="6.9%"
        />
        <PostItem 
          rank={3}
          title="Stop misusing useEffect"
          views="8.1k"
          likes="312"
          ctr="5.7%"
        />
        <PostItem 
          rank={4}
          title="Launched real-time collab tool"
          views="4.2k"
          likes="247"
          ctr="4.1%"
        />
      </div>
    </div>
  );
}
