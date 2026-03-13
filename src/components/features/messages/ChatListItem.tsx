import React from "react";
import { ChatListItemProps } from "../../../types/message";
import { CheckCheck } from "lucide-react";

export default function ChatListItem({
  conversation,
  selected,
  onClick,
  ...rest
}: ChatListItemProps & React.HTMLAttributes<HTMLDivElement>) {
  const other = conversation.participants[0];
  const last = conversation.lastMessage;

  return (
    <div
      {...rest}
      className={`flex items-center p-2 cursor-pointer transition-colors relative ${
        selected ? "bg-white border-l-4 border-teal-600" : "hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <img
        src={other.avatarUrl || "/images/avatar.png"}
        alt={other.name}
        className="w-10 h-12 rounded-full object-cover"
      />
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-center">
          <span className="font-medium text-sm">{other.name}</span>
          {last && (
            <span className="text-xs text-gray-500">
              {new Date(last.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
        {last && (
          <div className="flex items-center gap-1 overflow-hidden">
            {last.sender.id === "1" && (
              <CheckCheck className={`w-3.5 h-3.5 flex-shrink-0 ${last.status === 'read' ? 'text-blue-500' : 'text-gray-400'}`} />
            )}
            <p className="text-xs text-gray-600 truncate">{last.text}</p>
          </div>
        )}
      </div>
      {other.online && (
        <span className="w-2 h-2 bg-green-500 rounded-full ml-2" />
      )}
    </div>
  );
}
