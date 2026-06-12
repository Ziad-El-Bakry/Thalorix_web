'use client';

import React, { useState, useRef } from 'react';
import { ChevronDown, Sparkles, Coins, Paperclip, Loader2, FileCheck, ArrowRight } from 'lucide-react';
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
  credits?: number;
  onFileUpload?: (file: File) => void;
  uploadedFile?: { name: string } | null;
  isUploadingFile?: boolean;
}

export function AIChatInput({
  onGenerate,
  selectedModel,
  onModelSelect,
  isExpanded = false,
  isGenerating = false,
  credits,
  onFileUpload,
  uploadedFile,
  isUploadingFile = false,
}: AIChatInputProps) {
  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating || credits === 0) return;
    onGenerate(prompt, selectedModel);
    setPrompt('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
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
            ? 'Example: Create a React application with responsive navbar and dashboard...'
            : 'Ask anything ...'
        }
        className={`w-full bg-transparent text-[#103B40] placeholder:text-gray-400 resize-none outline-none text-sm ${
          isExpanded ? 'flex-1 min-h-[70px]' : 'h-[24px]'
        }`}
        disabled={isGenerating || credits === 0}
      />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        className="hidden"
      />

      <div
        className={`flex flex-wrap items-center justify-between gap-y-3 mt-3 pt-3 ${
          isExpanded ? 'border-t border-gray-100' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#103B40] text-white hover:bg-teal-800 transition-colors text-xs font-medium cursor-pointer">
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

          {/* Upload Button */}
          {onFileUpload && (
            <button
              type="button"
              onClick={handleAttachClick}
              disabled={isUploadingFile || isGenerating}
              className="p-1.5 text-gray-400 hover:text-[#103B40] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
              title="Attach Image or PDF (max 20MB)"
            >
              {isUploadingFile ? (
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              ) : (
                <Paperclip className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Uploaded File Badge */}
          {uploadedFile && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="max-w-[120px] truncate">{uploadedFile.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {credits !== undefined && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${credits === 0 ? 'bg-red-50 text-red-700 border-red-100' : 'bg-teal-50 text-teal-700 border-teal-100'}`}>
              <Coins className="w-3.5 h-3.5" />
              {credits} {credits === 1 ? 'Credit' : 'Credits'}
            </div>
          )}
          {isExpanded && (
            <span className="text-xs text-gray-400">Max. 1K chars</span>
          )}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating || credits === 0 || isUploadingFile}
            className="flex items-center justify-center bg-[#103B40] hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors shadow-sm cursor-pointer"
            title="Generate Code"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
