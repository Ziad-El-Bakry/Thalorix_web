"use client";

import React, { useState } from "react";
import { Conversation, User } from "../../../types/message";
import ChatListItem from "./ChatListItem";
import { MessageSquarePlus, MoreVertical } from "lucide-react";

const dummyUser: User = {
  id: "1",
  name: "William",
  avatarUrl: "/images/avatar.png",
  online: true,
};

const dummyConversations: Conversation[] = Array.from({ length: 12}).map(
  (_, i) => ({
    id: String(i + 1),
    participants: [
      {
        id: String(i + 2),
        name: ["Omar", "Jhon", "Mahdy", "Tony", "Sara", "Emy", "Gemy", "Ghaly", "Ziad", "Ahmed", "Mohamed", "Ali"][i],
        avatarUrl: `/images/avatar.png`,
        online: i>=0 && i<=3,
      },
    ],
    messages: [],
    lastMessage: {
      id: "lm" + i,
      sender: dummyUser,
      text: "Hey, I think there's a mistake on my Code...",
      timestamp: new Date().toISOString(),
      status: "read",
    },
  }),
);

export default function ChatList({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const listRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (selectedId && listRef.current) {
      const el = listRef.current.querySelector(
        `[data-id="${selectedId}"]`,
      ) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedId]);

  return (
    <div
      ref={listRef}
      className="w-full md:w-[40%] md:min-w-[380px] md:max-w-[820px] border-r overflow-y-auto bg-white h-full flex-shrink-0"
    >
      <div className="p-4 font-semibold border-b flex justify-between items-center bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
        <span>Welcome User</span>
        <div className="flex gap-1 text-gray-600">
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors">
            <MessageSquarePlus className="w-5 h-5" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
      {dummyConversations.map((conv) => (
        <ChatListItem
          key={conv.id}
          conversation={conv}
          selected={conv.id === selectedId}
          onClick={() => onSelect(conv.id)}
          // pass id so item adds data attribute
          data-id={conv.id}
        />
      ))}
    </div>
  );
}
