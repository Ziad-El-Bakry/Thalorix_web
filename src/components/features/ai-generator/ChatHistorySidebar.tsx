'use client';

import React from 'react';
import { MessageSquare, Plus, Clock, Trash2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Conversation {
  id: string;
  title: string;
  preview: string;
  date: string;
}

interface ChatHistorySidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatHistorySidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
  isOpen,
  onToggle,
}: ChatHistorySidebarProps) {
  return (
    <motion.div
      initial={false}
      animate={{ 
        width: isOpen ? 260 : 0, 
        opacity: isOpen ? 1 : 0,
        marginRight: isOpen ? 20 : 0,
      }}
      className="flex-shrink-0 bg-white border border-gray-200 flex flex-col rounded-xl overflow-hidden shadow-sm relative sticky top-6 h-[calc(100vh-120px)]"
    >
      <div className="w-[260px] flex flex-col h-full">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-[#103B40]">History</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onNewChat}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#103B40] text-white hover:bg-teal-800 transition-colors text-[11px] font-medium shadow-sm"
            >
              <Plus className="w-3 h-3" />
              New Chat
            </button>
            <button
              onClick={onToggle}
              className="p-1.5 text-gray-400 hover:text-[#103B40] hover:bg-gray-100 rounded-lg transition-colors"
              title="Close sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                No conversations yet.<br />Start a new chat to begin.
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <motion.div
                key={conv.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(conv.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(conv.id);
                  }
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all group relative cursor-pointer ${
                  activeId === conv.id
                    ? 'bg-[#103B40]/8 border border-[#103B40]/15'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <MessageSquare className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                    activeId === conv.id ? 'text-[#103B40]' : 'text-gray-300'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-medium truncate ${
                      activeId === conv.id ? 'text-[#103B40]' : 'text-gray-700'
                    }`}>
                      {conv.title}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">
                      {conv.preview}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1.5 ml-6">
                  <span className="text-[10px] text-gray-300">{conv.date}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3 text-gray-300 hover:text-red-400 transition-colors" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
