import React from "react";
import { ChatListItemProps } from "../../../types/message";
import { CheckCheck, Check } from "lucide-react";
import { authService } from "@/lib/api/services/auth.service";
import { useChatStore } from "@/store/useChatStore";

const AVATAR_COLORS = [
  "bg-teal-600",
  "bg-blue-600",
  "bg-purple-600",
  "bg-orange-500",
  "bg-pink-600",
  "bg-indigo-600",
  "bg-rose-600",
  "bg-amber-600",
  "bg-cyan-600",
  "bg-emerald-600",
  "bg-red-600",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function ChatListItem({
  conversation,
  selected,
  onClick,
  selectionMode,
  isItemSelected,
  ...rest
}: any) {
  const other = conversation.participants[0] || { name: "Unknown", avatarUrl: "/images/avatar.png" };
  const last = conversation.lastMessage;
  const colorClass = getAvatarColor(other.name);
  const unread = !selected ? (conversation.unreadCount || 0) : 0;
  const currentUserId = authService.getStoredUser()?.id || "current_user_id";

  return (
    <div
      {...rest}
      className={`flex items-center px-3 py-2.5 cursor-pointer transition-colors relative border-b border-gray-50 ${
        selected
          ? "bg-[#103B40]/5 border-l-[3px] border-l-[#103B40]"
          : "hover:bg-gray-50 border-l-[3px] border-l-transparent"
      }`}
      onClick={onClick}
    >
      {selectionMode && (
        <div className="mr-3 flex items-center justify-center">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isItemSelected ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
            {isItemSelected && <Check className="w-3.5 h-3.5 text-white" />}
          </div>
        </div>
      )}
      
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={other.avatarUrl || other.avatar || other.logo || "/images/avatar.png"}
          alt={other.name}
          className="w-11 h-11 rounded-full object-cover shadow-md"
        />
        {other.online && (
          <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Content */}
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <span className={`text-sm truncate pr-2 ${selected || unread ? "font-semibold text-gray-900" : "font-medium text-gray-800"}`}>
            {other.name}
          </span>
          {last && (
            <span suppressHydrationWarning className={`text-[11px] flex-shrink-0 ${unread ? "text-[#103B40] font-medium" : "text-gray-400"}`}>
              {new Date(last.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })}
            </span>
          )}
        </div>
        {last && (
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              {(last.sender.id === currentUserId || last.sender.id === "me") && (
                <CheckCheck
                  className={`w-3.5 h-3.5 flex-shrink-0 ${
                    last.status === "read" ? "text-blue-500" : "text-gray-400"
                  }`}
                />
              )}
              <p className={`text-xs truncate ${unread ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                {last.text || (last.imageUrl ? "Photo" : last.fileUrl ? "Document" : last.audioUrl ? "Voice message" : "Message")}
              </p>
            </div>  
            {unread > 0 && (
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#103B40] text-white text-[10px] font-semibold flex items-center justify-center">
                {unread}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}