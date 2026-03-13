"use client";

import React, { useState, useRef, useEffect } from "react";
import { Conversation, Message } from "../../../types/message";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { X } from "lucide-react";

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
  const containerRef = useRef<HTMLDivElement>(null);

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
      sender: { id: "1", name: "Emad", avatarUrl: "/images/avatar.png" },
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

  const otherUser = conversation.participants?.[0] || { id: "1", name: "User", online: true, avatarUrl: "/images/avatar.png" };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f0f2f5] relative">
      <ChatHeader user={otherUser} onBack={onBack} onSearch={setSearchQuery} />
      <div ref={containerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
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