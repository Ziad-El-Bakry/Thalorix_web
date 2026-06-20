"use client";

import Image from "next/image";

interface ActivityItemProps {
  icon: string;
  iconBg: string;
  title: React.ReactNode;
  subtitle: string;
}

function ActivityItem({ icon, iconBg, title, subtitle }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 mb-6 last:mb-0">
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm"
        style={{ backgroundColor: iconBg }}
      >
        <span className="text-sm">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">{title}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

export default function LiveActivity() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full relative">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></div>
        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase">Live Activity</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <ActivityItem
          icon="❤️"
          iconBg="#FCE7F3"
          title={<><strong>Priya Sharma</strong> liked your post</>}
          subtitle="React Tips • 2m ago"
        />
        <ActivityItem
          icon="💬"
          iconBg="#E0F2FE"
          title={<><strong>Alex Johnson</strong> commented</>}
          subtitle="Open Source • 14m ago"
        />
        <ActivityItem
          icon="🔄"
          iconBg="#DBEAFE"
          title={<><strong>Kevin Choi</strong> reposted your article</>}
          subtitle="Architecture • 1h ago"
        />
        <ActivityItem
          icon="🎉"
          iconBg="#FEF3C7"
          title={<><strong>You reached 1,400 connections!</strong></>}
          subtitle="Milestone • 3h ago"
        />
        <ActivityItem
          icon="👁️"
          iconBg="#F3F4F6"
          title={<><strong>Lena Fischer</strong> viewed your profile</>}
          subtitle="Berlin, Germany • 5h ago"
        />
      </div>

      {/* Gradient fade at bottom for scrolling indication */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none rounded-b-2xl"></div>
    </div>
  );
}
