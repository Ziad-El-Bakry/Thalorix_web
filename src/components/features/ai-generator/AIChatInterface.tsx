'use client';

import React, { useEffect, useRef } from 'react';
import { AIMessage, AIModel } from '@/types/ai';
import { MessageBubble } from './MessageBubble';
import { AIChatInput } from './AIChatInput';
import { RotateCcw } from 'lucide-react';

interface AIChatInterfaceProps {
  messages: AIMessage[];
  isGenerating: boolean;
  onGenerate: (prompt: string, model: AIModel) => void;
  selectedModel: AIModel;
  onModelSelect: (model: AIModel) => void;
  onReset: () => void;
}

export function AIChatInterface({
  messages,
  isGenerating,
  onGenerate,
  selectedModel,
  onModelSelect,
  onReset,
}: AIChatInterfaceProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  return (
    <div className="flex flex-col h-full relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pb-32 pt-6 px-4">
        <div className="max-w-4xl mx-auto w-full">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {isGenerating && (
            <div className="flex justify-start mb-8">
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-10 h-10 rounded-full bg-teal-900/50 flex items-center justify-center border border-teal-500/20 shadow-md">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
                <div className="flex items-center text-sm font-medium text-slate-400">
                  Thalorix-X Vision is thinking...
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area (Sticky at bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-10">
        <div className="max-w-4xl mx-auto w-full relative">
          
          {/* Top actions above input */}
          <div className="flex justify-between items-center mb-2 px-2">
            <button 
              onClick={onReset}
              className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700/50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New prompt
            </button>
            {!isGenerating && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
              <span className="text-xs text-slate-500">Generation complete ✓</span>
            )}
          </div>

          <AIChatInput
            onGenerate={onGenerate}
            selectedModel={selectedModel}
            onModelSelect={onModelSelect}
            isExpanded={false}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
}
