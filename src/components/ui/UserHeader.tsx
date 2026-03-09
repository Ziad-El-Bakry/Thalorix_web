import Image from "next/image";
import { Bell, Code } from "lucide-react";
import { Button } from "./button";
import { motion } from "framer-motion";

interface UserHeaderProps {
  name?: string;
  avatar?: string;
  badge?: string;
  badgeIcon?: string;
}

export default function UserHeader({ name, avatar, badge, badgeIcon }: UserHeaderProps) {
  // Fallback avatar if none provided
  const avatarSrc = avatar || "/images/avatar.png";
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between mb-6 md:mb-8 mt-2 md:mt-0"
    >
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex flex-shrink-0">
          <Image
            src={avatarSrc}
            alt="User Avatar"
            width={70}
            height={50}
            className="w-12 h-12 md:w-[70px] md:h-[70px] rounded-full object-cover shadow-sm"
          />
        </div>
        <div>
          <h1 className="text-xl md:text-[22px] font-bold text-[#103B40] mb-0.5 md:mb-1">
            Welcome {name}
          </h1>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
          <Bell size={24} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {badge && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="primary" className="rounded-full px-5 py-2 h-10 gap-2 text-sm shadow-sm">
              <Code size={16} />
              {badge}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
