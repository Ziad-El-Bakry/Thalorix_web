'use client';

import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { AIModel } from '@/types/ai';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AIChatInputProps {
  onGenerate: (prompt: string, model: AIModel) => void;
  selectedModel: AIModel;
  onModelSelect: (model: AIModel) => void;
  isExpanded?: boolean;
  isGenerating?: boolean;
}

export function AIChatInput({
  onGenerate,
  selectedModel,
  onModelSelect,
  isExpanded = false,
  isGenerating = false,
}: AIChatInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt, selectedModel);
    setPrompt('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const models: { id: AIModel; label: string; desc: string }[] = [
    { id: 'Thalorix-X Pro', label: 'Thalorix-X Pro', desc: 'Best for complex code & architecture' },
    { id: 'Thalorix-X Fast', label: 'Thalorix-X Fast', desc: 'Optimized for quick code snippets' },
    { id: 'Thalorix-X Mini', label: 'Thalorix-X Mini', desc: 'Lightweight model for simple tasks' },
    { id: 'Thalorix-X Vision', label: 'Thalorix-X Vision', desc: 'Code from images & diagrams' },
  ];

  return (
    <div
      className={`relative bg-white border border-gray-200 rounded-2xl p-4 shadow-sm focus-within:border-[#103B40]/40 focus-within:shadow-md transition-all ${
        isExpanded ? 'min-h-[150px] flex flex-col' : ''
      }`}
    >
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          isExpanded
            ? 'Example: Create a C++ code for a user profile card with avatar, name, ...'
            : 'Type a new prompt or continue the conversation...'
        }
        className={`w-full bg-transparent text-[#103B40] placeholder:text-gray-400 resize-none outline-none text-sm ${
          isExpanded ? 'flex-1 min-h-[70px]' : 'h-[24px]'
        }`}
        disabled={isGenerating}
      />

      <div
        className={`flex items-center justify-between mt-3 pt-3 ${
          isExpanded ? 'border-t border-gray-100' : ''
        }`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#103B40] text-white hover:bg-teal-800 transition-colors text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              {selectedModel}
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[280px] bg-white border-gray-200 text-[#103B40]"
            align="start"
            sideOffset={8}
          >
            {models.map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => onModelSelect(model.id)}
                className={`flex flex-col items-start gap-1 p-3 cursor-pointer focus:bg-gray-50 ${
                  selectedModel === model.id ? 'bg-[#103B40]/5' : ''
                }`}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-medium text-[#103B40] text-sm">{model.label}</span>
                  {selectedModel === model.id && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-teal-600" />
                  )}
                </div>
                <span className="text-xs text-gray-400">{model.desc}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-3">
          {isExpanded && (
            <span className="text-xs text-gray-400">Max. 1K chars</span>
          )}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="flex items-center gap-2 bg-[#103B40] hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors text-xs shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate Code
          </button>
        </div>
      </div>
    </div>
  );
}
