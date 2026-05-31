import React, { useState } from "react";
import Link from "next/link";
import { ChatHeaderProps } from "../../../types/message";
import { Search, MoreHorizontal, ArrowLeft, X, Trash2, Ban } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";

export default function ChatHeader({ user, onBack, onSearch }: ChatHeaderProps & { onBack?: () => void; onSearch?: (query: string) => void }) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const { deleteConversation } = useChatStore();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this conversation?")) {
      deleteConversation(user.id);
      if (onBack) onBack();
    }
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b bg-[#103B40] sticky top-0 z-10 shadow-lg shadow-black/20 h-[56px] min-h-[56px]">
      {isSearching ? (
        <div className="flex items-center w-full gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              placeholder="Search in conversation..."
              className="w-full bg-white border border-transparent rounded-full py-1.5 pl-9 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-white transition-all block shadow-inner"
            />
          </div>
          <button
            onClick={() => {
              setIsSearching(false);
              setSearchQuery("");
              onSearch?.("");
            }}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            )}
            <Link href={`/dashboard/profile/${user.id}`} className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer">
              <div className="relative">
                <img
                  src={user.avatarUrl || "/images/avatar.png"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                />
              </div>
              <div>
                <h2 className="font-semibold text-white text-sm leading-tight">{user.name}</h2>
                {user.online ? (
                  <span className="text-xs text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#9EC8FF] rounded-full inline-block animate-pulse" />
                    Online
                  </span>
                ) : (
                  <span className="text-xs text-white/50">Offline</span>
                )}
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              aria-label="Search"
              onClick={() => setIsSearching(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white hover:bg-white/15 active:bg-white/25 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
            
            <div className="relative">
              <button
                aria-label="More"
                onClick={() => setShowMenu(!showMenu)}
                className="w-9 h-9 flex items-center justify-center rounded-full text-white hover:bg-white/15 active:bg-white/25 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100">
                  <button
                    onClick={() => { setShowMenu(false); handleDelete(); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Conversation
                  </button>
                  <button
                    onClick={() => setShowMenu(false)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Ban className="w-4 h-4" />
                    Block User
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
