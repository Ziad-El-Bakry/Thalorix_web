import Image from "next/image";

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
    <div className="flex items-center justify-between mb-6 md:mb-8 mt-2 md:mt-0">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex flex-shrink-0">
          <Image
            src={avatarSrc}
            alt="User Avatar"
            width={70}
            height={50}
            className="w-12 h-12 md:w-[70px] md:h-[70px] rounded-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-xl md:text-[22px] font-bold text-[#103B40] mb-0.5 md:mb-1">
            Welcome {name}
          </h1>
        </div>
      </div>

      {badge && (
        <button className="flex items-center gap-1 md:gap-1.5 px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          {badgeIcon && <span className="text-base md:text-[17px]">{badgeIcon}</span>}
          <span>{badge}</span>
        </button>
      )}
    </div>
  );
}
