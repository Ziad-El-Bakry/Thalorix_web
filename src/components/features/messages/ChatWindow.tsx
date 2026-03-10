"use client";

import React, { useState } from "react";
import { Conversation, Message } from "../../../types/message";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

// static conversation example
const sampleConv: Conversation = {
  id: "1",
  participants: [
    {
      id: "2",
      name: "William",
      avatarUrl: "/images/avatar-1.jpg",
      online: true,
    },
  ],
  messages: [
    {
      id: "m1",
      sender: {
        id: "2",
        name: "William",
        avatarUrl: "/images/avatar.png",
      },
      text: "Are you there? interested i this loads? Can we continue to talk ?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      status: "delivered",
    },
    {
      id: "m2",
      sender: {
        id: "1",
        name: "Emad",
        avatarUrl: "/images/avatar-0.jpg",
      },
      text: "Hello? interested in this loads?",
      timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      status: "read",
    },
    {
      id: "m3",
      sender: {
        id: "1",
        name: "Emad",
        avatarUrl: "/images/avatar-0.jpg",
      },
      text: "Coming i am waiting you now !",
      timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
      status: "failed",
    },
    {
      id: "m4",
      sender: {
        id: "2",
        name: "William",
        avatarUrl: "/images/avatar-1.jpg",
      },
      text: "Hey, I think there's an issue with my account balance. Can you help me figure out what's going on?",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      status: "delivered",
    },
    {
      id: "m5",
      sender: {
        id: "1",
        name: "Emad",
        avatarUrl: "/images/avatar-0.jpg",
      },
      text: "Hi, I received an email about a charge that I don't recognize. Can you help me investigate this?",
      timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      status: "sent",
    },
    {
      id: "m6",
      sender: {
        id: "2",
        name: "William",
        avatarUrl: "/images/avatar-1.jpg",
      },
      text: "Hi, I accidentally deleted some important files from my account. Is there any way to recover them?",
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      status: "delivered",
    },
  ],
  lastMessage: undefined,
};

export default function ChatWindow({ onBack }: { onBack?: () => void }) {
  const [conversation, setConversation] = useState<Conversation>(sampleConv);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() === "") return;
    const newMsg: Message = {
      id: String(Date.now()),
      sender: {
        id: "1",
        name: "Emad",
        avatarUrl: "/images/avatar-0.jpg",
      },
      text: inputValue,
      timestamp: new Date().toISOString(),
      status: "sent",
    };
    setConversation((c) => ({
      ...c,
      messages: [...c.messages, newMsg],
    }));
    setInputValue("");
  };

  const other = conversation.participants[0];
  const containerRef = React.useRef<HTMLDivElement>(null);

  // scroll to bottom whenever messages change
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [conversation.messages]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader user={other} onBack={onBack} />
      <div
        ref={containerRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-100"
      >
        {/* date separator example */}
        <div className="flex justify-center mb-4">
          <span className="text-xs bg-gray-300 text-gray-700 px-3 py-1 rounded-full">
            Today
          </span>
        </div>
        {conversation.messages.map((m) => (
          <MessageBubble key={m.id} message={m} isOwn={m.sender.id === "1"} />
        ))}
      </div>
      <MessageInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
      />
    </div>
  );
}
