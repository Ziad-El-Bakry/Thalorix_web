import React from "react";
import { ChatHeaderProps } from "../../../types/message";
import { Search, Phone, Video, MoreHorizontal, ArrowLeft } from "lucide-react";

export default function ChatHeader({ user, onBack }: ChatHeaderProps & { onBack?: () => void }) {
  return (
    <div className="flex items-center justify-between p-2 border-b bg-white sticky top-0 z-10">
      <div className="flex items-center">
        {onBack && (
          <button 
            onClick={onBack}
            className="md:hidden mr-2 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
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
      <div className="flex items-center space-x-1 text-gray-700">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <Phone className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <Video className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
