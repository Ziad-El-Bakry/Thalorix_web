"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ChatList, ChatWindow } from "../../../components/features/messages";
import { useChatState } from "../../../components/features/messages/useChatState";
import { Conversation } from "../../../types/message";
import { useChatStore } from "../../../store/useChatStore";

const MIN_LIST_WIDTH = 280;
const MAX_LIST_WIDTH = 560;
const DEFAULT_LIST_WIDTH = 380;

function MessagesContent() {
  const searchParams = useSearchParams();
  const userIdFromUrl = searchParams?.get("user");

  const { 
    conversations, 
    activeConversationId, 
    setActiveConversation, 
    init, 
    cleanup, 
    loadConversations 
  } = useChatStore();

  const { setIsChatOpen } = useChatState();

  const [listWidth, setListWidth] = useState(DEFAULT_LIST_WIDTH);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find((c) => c.id === activeConversationId);

  useEffect(() => {
    init();
    loadConversations();
    return () => cleanup();
  }, [init, loadConversations, cleanup]);

  useEffect(() => {
    setIsChatOpen(!!activeConversationId);
    return () => setIsChatOpen(false);
  }, [activeConversationId, setIsChatOpen]);

  useEffect(() => {
    if (userIdFromUrl && conversations.length > 0) {
      const existing = conversations.find(c => c.participants.some(p => p.id === userIdFromUrl));
      if (existing) {
        setTimeout(() => setActiveConversation(existing.id), 0);
      } else {
        // We could create a temp conversation in the store here if needed.
        // For now, if no conversation exists, we just wait for the user to send the first message 
        // from the profile page or rely on the backend.
      }
    }
  }, [userIdFromUrl, conversations.length, setActiveConversation]);

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

  const mobileHeightClass = activeConversationId ? "h-[100vh]" : "h-[calc(100vh-74px)]";

  return (
    <div
      ref={containerRef}
      className={`flex flex-row flex-1 ${mobileHeightClass} md:h-[calc(100vh-60px)] lg:h-[100vh] w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] lg:w-[calc(100%+5rem)] overflow-hidden -mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10`}
    >
      {/* Chat List Panel */}
      <div
        className={`h-full flex-shrink-0 ${activeConversationId ? "hidden md:block md:w-[var(--list-width)]" : "w-full md:w-[var(--list-width)]"}`}
        style={{ "--list-width": `${listWidth}px` } as React.CSSProperties}
      >
        <ChatList
          conversations={conversations}
          selectedId={activeConversationId}
          onSelect={setActiveConversation}
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
      <div className={`flex-1 flex flex-col overflow-hidden h-full ${!activeConversationId ? "hidden md:flex" : "flex"}`}>
        <ChatWindow
          conversation={selectedConversation}
          onBack={() => setActiveConversation(null)}
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
