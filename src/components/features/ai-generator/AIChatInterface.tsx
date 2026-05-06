'use client';

import React, { useEffect, useRef } from 'react';
import { AIMessage, AIModel } from '@/types/ai';
import { MessageBubble } from './MessageBubble';
import { AIChatInput } from './AIChatInput';
import { Terminal } from 'lucide-react';

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
    <div className="flex flex-col relative w-full flex-1">
      {/* Messages Area */}
      <div className="flex-1 w-full pb-8 pt-4 px-2">
        <div className="max-w-3xl mx-auto w-full">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isGenerating && (
            <div className="flex justify-start mb-6">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-9 h-9 rounded-full bg-[#103B40] flex items-center justify-center shadow-sm">
                  <Terminal className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-2.5 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#103B40] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#103B40] rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-[#103B40] rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                  <span className="text-xs text-gray-400 ml-1">Generating...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area - Sticky at bottom */}
      <div className="sticky bottom-0 left-0 right-0 px-4 pb-4 pt-6 bg-gradient-to-t from-gray-50 via-gray-50/95 to-transparent z-10 mt-auto">
        <div className="max-w-3xl mx-auto w-full">
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
