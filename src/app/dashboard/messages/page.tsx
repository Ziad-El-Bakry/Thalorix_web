"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ChatList, ChatWindow } from "../../../components/features/messages";
import { useChatState } from "../../../components/features/messages/useChatState";
import { Conversation } from "../../../types/message";
import { dummyConversations } from "../../../components/features/messages/ChatList";

const MIN_LIST_WIDTH = 280;
const MAX_LIST_WIDTH = 560;
const DEFAULT_LIST_WIDTH = 380;

function MessagesContent() {
  const searchParams = useSearchParams();
  const userIdFromUrl = searchParams?.get("user");

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { setIsChatOpen } = useChatState();
  const [conversations, setConversations] = useState<Conversation[]>(dummyConversations);
  const [listWidth, setListWidth] = useState(DEFAULT_LIST_WIDTH);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find((c) => c.id === selectedChatId);

  useEffect(() => {
    setIsChatOpen(!!selectedChatId);
    return () => setIsChatOpen(false);
  }, [selectedChatId, setIsChatOpen]);

  useEffect(() => {
    if (userIdFromUrl) {
      setConversations(prev => {
        const existing = prev.find(c => c.participants.some(p => p.id === userIdFromUrl));
        if (existing) {
          // Wrap setSelectedChatId in setTimeout to avoid updating state during existing state transition
          setTimeout(() => setSelectedChatId(existing.id), 0);
          return prev;
        } else {
          const newChatId = "new_chat_" + userIdFromUrl;
          const newConversation: Conversation = {
            id: newChatId,
            participants: [
              {
                id: userIdFromUrl,
                name: userIdFromUrl === "1" ? "Adel Ghamri" : userIdFromUrl === "2" ? "Sara" : "User " + userIdFromUrl,
                avatarUrl: userIdFromUrl === "1" ? "/images/profile1.png" : userIdFromUrl === "2" ? "/images/profile2.png" : "/images/avatar.png",
                online: true,
              }
            ],
            messages: [],
            lastMessage: {
              id: "fake_last_msg",
              sender: { id: "2" },
              text: "Start of your conversation",
              timestamp: new Date().toISOString(),
              status: "delivered"
            } as any
          };
          setTimeout(() => setSelectedChatId(newChatId), 0);
          
          // Persist the newly created chat to the global dummy memory so it survives page unmounts
          const dummyExists = dummyConversations.find(c => c.id === newConversation.id);
          if (!dummyExists) {
            dummyConversations.unshift(newConversation);
          }
          
          return [newConversation, ...prev];
        }
      });
    }
  }, [userIdFromUrl]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      setListWidth(Math.min(MAX_LIST_WIDTH, Math.max(MIN_LIST_WIDTH, newWidth)));
    };
    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const mobileHeightClass = selectedChatId ? "h-[100vh]" : "h-[calc(100vh-74px)]";

  return (
    <div
      ref={containerRef}
      className={`flex flex-row flex-1 ${mobileHeightClass} md:h-[calc(100vh-60px)] lg:h-[100vh] w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] lg:w-[calc(100%+5rem)] overflow-hidden -mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10`}
    >
      {/* Chat List Panel */}
      <div
        className={`h-full flex-shrink-0 ${selectedChatId ? "hidden md:block md:w-[var(--list-width)]" : "w-full md:w-[var(--list-width)]"}`}
        style={{ "--list-width": `${listWidth}px` } as React.CSSProperties}
      >
        <ChatList
          conversations={conversations}
          selectedId={selectedChatId}
          onSelect={setSelectedChatId}
        />
      </div>

      {/* Draggable Divider — hidden on mobile */}
      <div
        onMouseDown={onMouseDown}
        className="hidden md:flex w-1 h-full bg-[#103B40] cursor-col-resize flex-shrink-0 items-center justify-center group hover:w-[5px] transition-all duration-150"
        style={{ boxShadow: "4px 0 8px rgba(0,0,0,0.18), -4px 0 8px rgba(0,0,0,0.18)" }}
        title="Drag to resize"
      >
        {/* Grip dots */}
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-60 transition-opacity">
          {[0,1,2].map(i => (
            <div key={i} className="w-1 h-1 rounded-full bg-white" />
          ))}
        </div>
      </div>

      {/* Chat Window Panel */}
      <div className={`flex-1 flex flex-col overflow-hidden h-full ${!selectedChatId ? "hidden md:flex" : "flex"}`}>
        <ChatWindow
          conversation={selectedConversation}
          onBack={() => setSelectedChatId(null)}
        />
      </div>
    </div>
  );
}

export default function Messages() {
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
      <MessagesContent />
    </React.Suspense>
  );
}
