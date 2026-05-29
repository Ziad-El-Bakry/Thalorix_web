"use client";

import Image from "next/image";
import Link from "next/link";
import { Code, User as UserIcon, Store, Shield } from "lucide-react";
import Notifications from "@/components/shared/Notification";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import { motion } from "framer-motion";
import { useAvatar } from "@/store/useAvatarStore";
import { useEffect, useState } from "react";
import { authService, User } from "@/lib/api/services/auth.service";

interface UserHeaderProps {
  name?: string;
  avatar?: string;
  badge?: string;
  badgeIcon?: string;
  compact?: boolean;
}

export default function UserHeader({ name, avatar, badge, badgeIcon, compact = false }: UserHeaderProps) {
  const { avatar: globalAvatar } = useAvatar();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser as User);
    }
  }, []);

  // Use prop avatar first, then global avatar from store
  const avatarSrc = avatar || globalAvatar || "/images/avatar.png";
  const pathname = usePathname();
  const isMessagesPage = pathname?.includes("/messages");

  const displayBadge = badge || (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : null);
  const displayName = name || (user ? (user.name || user.username)?.split(' ')[0] : "User");

  const getRoleIcon = () => {
    if (!displayBadge) return <Code size={compact ? 14 : 16} />;
    const roleStr = displayBadge.toLowerCase();
    if (roleStr === 'admin') return <Shield size={compact ? 14 : 16} />;
    if (roleStr === 'seller') return <Store size={compact ? 14 : 16} />;
    if (roleStr === 'user') return <UserIcon size={compact ? 14 : 16} />;
    return <Code size={compact ? 14 : 16} />;
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-between mt-2 md:mt-0 relative z-50 ${compact ? 'mb-2 md:mb-3' : 'mb-6 md:mb-8'}`}
    >
      <Link href="/dashboard/profile" className="flex items-center gap-3 md:gap-4 hover:opacity-85 transition-opacity cursor-pointer">
        <div className="flex flex-shrink-0">
          <Image
            src={avatarSrc}
            alt="User Avatar"
            width={70}
            height={70}
            className={`${compact ? 'w-10 h-10 md:w-[45px] md:h-[45px]' : 'w-12 h-12 md:w-[70px] md:h-[70px]'} rounded-full object-cover shadow-sm`}
          />
        </div>
        <div>
          <h1 className={`${compact ? 'text-lg md:text-[18px]' : 'text-xl md:text-[22px]'} font-bold text-[#103B40] mb-0.5 md:mb-1`}>
            Welcome {displayName}
          </h1>
        </div>
      </Link>

      <div className="flex gap-4 items-center">
        {!isMessagesPage && (
          <div className={compact ? 'scale-90' : ''}>
            <Notifications />
          </div>
        )}

        {displayBadge && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="primary" className={`rounded-full gap-2 shadow-sm flex items-center ${compact ? 'px-4 py-1.5 h-8 text-xs' : 'px-5 py-2 h-10 text-sm'}`}>
              {getRoleIcon()}
              {displayBadge}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
