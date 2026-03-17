"use client";

import React, { useState, useMemo } from "react";
import { Conversation, User } from "../../../types/message";
import ChatListItem from "./ChatListItem";
import { MessageSquarePlus, MoreVertical, Search } from "lucide-react";

export const dummyUser: User = {
  id: "1",
  name: "William",
  avatarUrl: "/images/avatar.png",
  online: true,
};

const names = ["Omar", "John", "Mahdy", "Tony", "Sara", "Emy", "Gemy", "Ghaly", "Ziad", "Ahmed", "Mohamed", "Ali"];

export const dummyConversations: Conversation[] = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  participants: [
    {
      id: String(i + 2),
      name: names[i],
      avatarUrl: "",
      online: i >= 0 && i <= 3,
    },
  ],
  messages: [
    {
      id: "lm" + i,
      sender: {
        id: "2",
        name: names[i],
        avatarUrl: "",
      },
      text: i % 3 === 0
        ? "Hey, I think there's a mistake on my Code..."
        : i % 3 === 1
        ? "Can you review the PR before tomorrow?"
        : "Meeting confirmed at 3pm today 👍",
      timestamp: new Date(Date.now() - i * 8 * 60 * 1000).toISOString(),
      status: i < 4 ? "read" : "delivered",
    }
  ],
  lastMessage: {
    id: "lm" + i,
    sender: {
      id: "2",
      name: names[i],
      avatarUrl: "",
    },
    text: i % 3 === 0
      ? "Hey, I think there's a mistake on my Code..."
      : i % 3 === 1
      ? "Can you review the PR before tomorrow?"
      : "Meeting confirmed at 3pm today 👍",
    timestamp: new Date(Date.now() - i * 8 * 60 * 1000).toISOString(),
    status: i < 4 ? "read" : "delivered",
  },
}));

export default function ChatList({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (selectedId && listRef.current) {
      const el = listRef.current.querySelector(`[data-id="${selectedId}"]`) as HTMLElement | null;
      if (el) el.scrollIntoView({ block: "nearest" });
    }
  }, [selectedId]);

  const filtered = useMemo(() =>
    search.trim()
      ? dummyConversations.filter((c) =>
          c.participants[0].name.toLowerCase().includes(search.toLowerCase())
        )
      : dummyConversations,
    [search]
  );

  return (
    <div
      ref={listRef}
      className="w-full h-full overflow-hidden bg-white flex flex-col"
    >
      {/* Header */}
      <div className="px-4 py-3 flex justify-between items-center bg-[#103B40] sticky top-0 z-10 shadow-lg shadow-black/20">
        <span className="font-semibold text-white text-base">Messages</span>
        <div className="flex gap-1 text-white">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/15 transition-colors">
            <MessageSquarePlus className="w-4.5 h-4.5" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/15 transition-colors">
            <MoreVertical className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 bg-[#f0f2f5] border-b border-gray-100">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-white border border-gray-200 rounded-full py-2 pl-9 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400 transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
            <Search className="w-8 h-8 mb-2 opacity-30" />
            No conversations found
          </div>
        ) : (
          filtered.map((conv) => (
            <ChatListItem
              key={conv.id}
              conversation={conv}
              selected={conv.id === selectedId}
              onClick={() => onSelect(conv.id)}
              data-id={conv.id}
            />
          ))
        )}
      </div>
    </div>
  );
}