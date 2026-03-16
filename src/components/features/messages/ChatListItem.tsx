import React from "react";
import { ChatListItemProps } from "../../../types/message";
import { CheckCheck } from "lucide-react";

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
  ...rest
}: ChatListItemProps & React.HTMLAttributes<HTMLDivElement>) {
  const other = conversation.participants[0];
  const last = conversation.lastMessage;
  const colorClass = getAvatarColor(other.name);
  // Simulated unread count for demo (odd IDs get unread)
  const unread = !selected && parseInt(conversation.id) % 4 === 2 ? 2 : 0;

  return (
    <div
      {...rest}
      className={`flex items-center px-3 py-2.5 cursor-pointer transition-colors relative border-b border-gray-50 ${
        selected
          ? "bg-teal-50 border-l-[3px] border-l-teal-600"
          : "hover:bg-gray-50 border-l-[3px] border-l-transparent"
      }`}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {other.avatarUrl ? (
          <img
            src={other.avatarUrl}
            alt={other.name}
            className="w-11 h-11 rounded-full object-cover"
          />
        ) : (
          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-base ${colorClass}`}>
            {other.name.charAt(0).toUpperCase()}
          </div>
        )}
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
            <span suppressHydrationWarning className={`text-[11px] flex-shrink-0 ${unread ? "text-teal-600 font-medium" : "text-gray-400"}`}>
              {new Date(last.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })}
            </span>
          )}
        </div>
        {last && (
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              {last.sender.id === "1" && (
                <CheckCheck
                  className={`w-3.5 h-3.5 flex-shrink-0 ${
                    last.status === "read" ? "text-blue-500" : "text-gray-400"
                  }`}
                />
              )}
              <p className={`text-xs truncate ${unread ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                {last.text}
              </p>
            </div>  
            {unread > 0 && (
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-semibold flex items-center justify-center">
                {unread}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}