"use client";

interface AdminActivityItemProps {
  icon: string;
  iconBg: string;
  message: string;
  time: string;
}

export default function AdminActivityItem({ icon, iconBg, message, time }: AdminActivityItemProps) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      <p className="text-sm text-gray-700 flex-1 leading-snug">{message}</p>
      <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{time}</span>
    </div>
  );
}
