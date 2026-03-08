import React from "react";
import { ChatHeaderProps } from "../../../types/message";
import { Search, Phone, Video, MoreHorizontal } from "lucide-react";

export default function ChatHeader({ user }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
      <div className="flex items-center">
        <img
          src={user.avatarUrl || "/images/default-avatar.png"}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <h2 className="font-semibold text-lg">{user.name}</h2>
          {user.online && (
            <span className="text-sm text-green-500">Online</span>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4 text-gray-600">
        <Search className="w-5 h-5 cursor-pointer" />
        <Phone className="w-5 h-5 cursor-pointer" />
        <Video className="w-5 h-5 cursor-pointer" />
        <MoreHorizontal className="w-5 h-5 cursor-pointer" />
      </div>
    </div>
  );
}
