"use client";
 
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { User } from "@/lib/api/services/auth.service";
import { useAvatar } from "@/store/useAvatarStore";

interface DashboardHeaderProps {
  user: User | null;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const currentDate = new Date();
  const { avatar, setAvatar } = useAvatar();

  // Initialize store with user's backend avatar if available and store is default
  useEffect(() => {
    if (user?.avatar && avatar === "/images/avatar.png") {
      setAvatar(user.avatar);
    }
  }, [user?.avatar, avatar, setAvatar]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mb-8">
      <div className="mb-4 sm:mb-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Good morning, {(user?.name || user?.username)?.split(' ')[0] || "User"}   
       </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's what's happening with your profile today.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Date Pill */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentDate.toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        
        {/* User Avatar */}
        <Link href="/dashboard/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm relative block hover:opacity-85 transition-opacity cursor-pointer">
          <Image
            src={avatar !== "/images/avatar.png" ? avatar : (user?.avatar || user?.avatarUrl || user?.logo || "/images/avatar.png")}
            alt="User Avatar"
            fill
            className="object-cover"
          />
        </Link>
      </div>
    </div>
  );
}
