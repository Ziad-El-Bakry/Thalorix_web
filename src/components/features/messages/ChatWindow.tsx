"use client";

import React, { useState, useRef, useEffect } from "react";
import { Conversation, Message } from "../../../types/message";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { X } from "lucide-react";
import { useAvatar } from "@/store/useAvatarStore";

export default function ChatWindow({
  conversation,
  onBack
}: {
  conversation?: Conversation;
  onBack?: () => void
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { avatar: globalAvatar } = useAvatar();

  const otherUser = conversation?.participants?.[0] || { id: "1", name: "User", online: true, avatarUrl: "/images/avatar.png" };

  useEffect(() => {
    if (conversation) {
      setMessages(conversation.messages || []);
    } else {
      setMessages([]);
    }
  }, [conversation]);

  const handleSend = (content: string, type: "text" | "audio" | "image" | "file" | "pdf" | "zip" = "text", fileName?: string) => {
    if (type === "text" && content.trim() === "") return;

    const newMsg: Message = {
      id: String(Date.now()),
      sender: { id: "1", name: "Emad", avatarUrl: globalAvatar || "/images/avatar.png" },
      text: type === "text" ? content : undefined,
      audioUrl: type === "audio" ? content : undefined,
      imageUrl: type === "image" ? content : undefined,
      fileUrl: (type === "pdf" || type === "zip" || type === "file") ? content : undefined,
      fileType: (type === "pdf" || type === "zip" || type === "image" || type === "file") ? type as any : undefined,
      fileName: fileName,
      timestamp: new Date().toISOString(),
      status: "sent",
      replyToMessage: replyingTo || undefined,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
    setReplyingTo(null);

    // Simulate typing and auto-reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const autoReply: Message = {
        id: String(Date.now() + 1),
        sender: otherUser,
        text: "Thanks for the message! I'll get back to you shortly.",
        timestamp: new Date().toISOString(),
        status: "delivered"
      };
      setMessages(prev => [...prev, autoReply]);
    }, 2500);
  };

  const handleScroll = () => {
    if (!containerRef.current || isLoadingOlder) return;
    if (containerRef.current.scrollTop === 0) {
      setIsLoadingOlder(true);
      setTimeout(() => {
        const olderMessages = Array.from({ length: 5 }).map((_, i) => ({
          id: `old_${Date.now()}_${i}`,
          sender: otherUser,
          text: `This is an older mock message ${i + 1}`,
          timestamp: new Date(Date.now() - 86400000 * (i + 1)).toISOString(),
          status: "read" as const
        }));
        // preserve scroll position
        const prevHeight = containerRef.current!.scrollHeight;
        setMessages(prev => [...olderMessages.reverse(), ...prev]);
        setIsLoadingOlder(false);
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight - prevHeight;
          }
        }, 0);
      }, 1000);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#f0f2f5] items-center justify-center text-gray-500">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f0f2f5] relative">
      <ChatHeader user={otherUser} onBack={onBack} onSearch={setSearchQuery} />
      <div ref={containerRef} onScroll={handleScroll} className="flex-1 p-4 overflow-y-auto space-y-4">
        {isLoadingOlder && (
          <div className="flex justify-center py-2">
            <div className="w-5 h-5 border-2 border-[#103B40] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {messages
          .filter((m) => {
            if (!searchQuery) return true;
            if (!m.text) return false;
            return m.text.toLowerCase().includes(searchQuery.toLowerCase());
          })
          .map((m, index, arr) => {
            const currentMessageDate = new Date(m.timestamp).toDateString();
            const previousMessageDate = index > 0 ? new Date(arr[index - 1].timestamp).toDateString() : null;
            const showDate = currentMessageDate !== previousMessageDate;

            let dateLabel = currentMessageDate;
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (currentMessageDate === today.toDateString()) {
              dateLabel = "Today";
            } else if (currentMessageDate === yesterday.toDateString()) {
              dateLabel = "Yesterday";
            } else {
              dateLabel = new Date(m.timestamp).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
            }

            return (
              <React.Fragment key={m.id}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="bg-white/90 text-gray-500 text-xs font-medium px-4 py-1.5 rounded-full shadow-sm tracking-wide">
                      {dateLabel}
                    </span>
                  </div>
                )}
                <MessageBubble
                  message={m}
                  isOwn={m.sender.id === "1"}
                  onImageClick={(url: string) => setSelectedImage(url)}
                  onReply={(msg: Message) => setReplyingTo(msg)}
                />
              </React.Fragment>
            );
          })}

        {searchQuery && messages.filter(m => m.text?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
          <div className="w-full text-center text-gray-500 py-8 text-sm">
            No messages found matching "{searchQuery}"
          </div>
        )}

        {isTyping && (
          <div className="flex w-full mb-4">
            <div className="flex gap-1.5 items-center bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm w-fit shadow-sm">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      <MessageInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
      />

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors z-50"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt="Fullscreen view"
            className="max-w-full max-h-full object-contain rounded-md"
          />
        </div>
      )}
    </div>
  );
}