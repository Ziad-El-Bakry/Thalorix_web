"use client";

import React, { useState } from "react";
import { Conversation, User } from "../../../types/message";
import ChatListItem from "./ChatListItem";

const dummyUser: User = {
  id: "1",
  name: "William",
  avatarUrl: "/images/avatar-1.jpg",
  online: true,
};

const dummyConversations: Conversation[] = Array.from({ length: 8 }).map(
  (_, i) => ({
    id: String(i + 1),
    participants: [
      {
        id: String(i + 2),
        name: ["Omar", "Jhon", "Mahdy", "Tony", "Sara", "Emy", "Gemy", "Ghaly"][
          i
        ],
        avatarUrl: `/images/avatar-${i + 2}.jpg`,
        online: i % 2 === 0,
      },
    ],
    messages: [],
    lastMessage: {
      id: "lm" + i,
      sender: dummyUser,
      text: "Hey, I think there's a mistake on my...",
      timestamp: new Date().toISOString(),
      status: "read",
    },
  }),
);

export default function ChatList() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
      className="w-full max-w-xs border-r overflow-y-auto bg-white h-full"
    >
      <div className="p-4 font-semibold border-b">Welcome, Emad</div>
      {dummyConversations.map((conv) => (
        <ChatListItem
          key={conv.id}
          conversation={conv}
          selected={conv.id === selectedId}
          onClick={() => setSelectedId(conv.id)}
          // pass id so item adds data attribute
          data-id={conv.id}
        />
      ))}
    </div>
  );
}
