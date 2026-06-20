"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Conversation, Message } from "../../../types/message";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { X, Trash2, Download } from "lucide-react";
import { useAvatar } from "@/store/useAvatarStore";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import ConnectionStatusBanner from "./ConnectionStatusBanner";
import { motion, AnimatePresence } from "framer-motion";
import { backdropTransition, scaleIn } from "@/lib/utils/animations";

export default function ChatWindow({
  conversation,
  onBack
}: {
  conversation?: Conversation;
  onBack?: () => void
}) {
  const { messages: storeMessages, loadMessages, sendMessage, isTyping: globalTyping, sendTyping, replyingTo, setReplyingTo } = useChatStore();
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevScrollHeight = useRef<number>(0);
  const { avatar: globalAvatar } = useAvatar();
  const { currentUserId, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const otherUser = conversation?.participants?.[0] || { id: "1", name: "User", online: true, avatarUrl: "/images/avatar.png" };

  const messages = conversation ? storeMessages[conversation.id] || [] : [];
  const isTyping = globalTyping[otherUser.id] || false;

  useEffect(() => {
    if (conversation) {
      setPage(1);
      setSelectedMessages([]);
      loadMessages(conversation.id, 1);
    }
  }, [conversation?.id, loadMessages]);

  const { deleteMessage } = useChatStore();

  const handleDeleteSelected = () => {
    if (conversation && confirm(`Are you sure you want to delete ${selectedMessages.length} messages?`)) {
      selectedMessages.forEach(id => {
        deleteMessage(id, conversation.id);
      });
      setSelectedMessages([]);
    }
  };

  const handleInput = (val: string) => {
    setInputValue(val);
  };

  const handleSend = (content: string, type: "text" | "audio" | "image" | "file" | "pdf" | "zip" = "text", fileName?: string) => {
    if (type === "text" && content.trim() === "") return;
    
    let textContent = content;
    let attachmentUrl: string | undefined = undefined;
    
    if (type !== "text") {
      attachmentUrl = content;
      textContent = fileName || (type === "image" ? "Photo" : "Attachment");
    }

    sendMessage(otherUser.id, textContent, type, attachmentUrl, replyingTo?.id);
    setInputValue("");
    setReplyingTo(null);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      sendTyping(otherUser.id, false);
      typingTimeoutRef.current = null;
    }
  };

  useLayoutEffect(() => {
    if (containerRef.current && !isLoadingOlder) {
      const currentScrollHeight = containerRef.current.scrollHeight;
      // If scroll height increased and we are at the top (meaning we prepended old messages)
      if (currentScrollHeight > prevScrollHeight.current && containerRef.current.scrollTop === 0) {
        containerRef.current.scrollTop = currentScrollHeight - prevScrollHeight.current;
      }
      prevScrollHeight.current = currentScrollHeight;
    }
  }, [messages.length, isLoadingOlder]);

  const handleScroll = () => {
    if (!containerRef.current || isLoadingOlder || !conversation) return;
    if (containerRef.current.scrollTop === 0) {
      setIsLoadingOlder(true);
      const nextPage = page + 1;
      setPage(nextPage);
      
      prevScrollHeight.current = containerRef.current.scrollHeight;
      
      loadMessages(conversation.id, nextPage).finally(() => {
        setIsLoadingOlder(false);
      });
    }
  };

  const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lastMessageId, conversation?.id]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#f0f2f5] dark:bg-gray-950 items-center justify-center text-gray-500 dark:text-gray-400">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <motion.div
      key={conversation.id}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 flex flex-col h-full bg-[#f0f2f5] dark:bg-gray-950 relative"
    >
      <ConnectionStatusBanner />
      {selectedMessages.length > 0 ? (
        <div className="flex items-center justify-between px-4 py-2 border-b bg-teal-800 h-[56px] min-h-[56px] sticky top-0 z-10 shadow-lg shadow-black/20">
          <div className="flex items-center gap-4 text-white">
            <button onClick={() => setSelectedMessages([])} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            <span className="font-semibold">{selectedMessages.length} Selected</span>
          </div>
          <button onClick={handleDeleteSelected} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <ChatHeader user={otherUser} onBack={onBack} onSearch={setSearchQuery} />
      )}
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
                    <span className="bg-white/90 dark:bg-gray-800/90 text-gray-500 dark:text-gray-400 text-xs font-medium px-4 py-1.5 rounded-full shadow-sm tracking-wide">
                      {dateLabel}
                    </span>
                  </div>
                )}
                <MessageBubble
                  message={m}
                  isOwn={m.sender.id === currentUserId}
                  onImageClick={(url: string) => setSelectedImage(url)}
                  onReply={(msg: Message) => setReplyingTo(msg)}
                  selected={selectedMessages.includes(m.id)}
                  selectionMode={selectedMessages.length > 0}
                  onSelect={() => {
                    setSelectedMessages(prev => 
                      prev.includes(m.id) ? prev.filter(id => id !== m.id) : [...prev, m.id]
                    );
                  }}
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
            <div className="flex gap-1.5 items-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-tl-sm w-fit shadow-sm">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      <MessageInput
        value={inputValue}
        onChange={handleInput}
        onSend={handleSend}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        receiverId={otherUser.id}
      />

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backdropTransition}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          >
            <div className="absolute top-4 right-4 flex items-center gap-4 z-50">
              <button
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = selectedImage;
                  a.download = "image";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
                title="Download Image"
              >
                <Download className="w-6 h-6" />
              </button>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            <motion.img
              variants={scaleIn}
              src={selectedImage}
              alt="Fullscreen view"
              className="max-w-full max-h-full object-contain rounded-md"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}