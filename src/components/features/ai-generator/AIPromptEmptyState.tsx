'use client';

import React from 'react';
import { Code2, Layout, CalendarDays, Server } from 'lucide-react';
import { AIChatInput } from './AIChatInput';
import { AIModel } from '@/types/ai';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AIPromptEmptyStateProps {
  onGenerate: (prompt: string, model: AIModel) => void;
  selectedModel: AIModel;
  onModelSelect: (model: AIModel) => void;
  credits?: number;
}

export function AIPromptEmptyState({
  onGenerate,
  selectedModel,
  onModelSelect,
  credits,
}: AIPromptEmptyStateProps) {
  const suggestions = [
    {
      title: 'Python Email Validator',
      badge: 'Python',
      description: 'Build a Python function that validates email addresses using regex and returns true/false',
      icon: Code2,
    },
    {
      title: 'Responsive Navbar',
      badge: 'HTML/CSS',
      description: 'Create a responsive navigation bar in HTML/CSS with mobile hamburger menu using Tailwind CSS',
      icon: Layout,
    },
    {
      title: 'Sort by Date',
      badge: 'JavaScript',
      description: 'Write a JavaScript function to sort an array of objects by date property in ascending order',
      icon: CalendarDays,
    },
    {
      title: 'REST API Handler',
      badge: 'Node.js',
      description: 'Create a Node.js Express route handler for a REST API with error handling and validation',
      icon: Server,
    },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#103B40] text-white rounded-2xl mb-5 shadow-md">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#103B40] mb-2">AI Code Gen</h2>
        <p className="text-gray-500 text-sm md:text-base">
          Describe what you need and get production-ready code in seconds.
        </p>
      </motion.div>

      {/* Suggestion Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mb-10"
      >
        {suggestions.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 },
              }}
              onClick={() => onGenerate(item.description, selectedModel)}
              className="p-5 rounded-xl bg-white border border-gray-200 hover:border-[#103B40]/30 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#103B40]/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#103B40]" />
                  </div>
                  <h3 className="text-[#103B40] font-semibold text-sm group-hover:text-teal-700 transition-colors">
                    {item.title}
                  </h3>
                </div>
                <span className="text-[11px] px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full font-medium">
                  {item.badge}
                </span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed ml-[42px]">{item.description}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Prompt Input */}
      <div className="w-full max-w-3xl mb-10">
        <AIChatInput
          onGenerate={onGenerate}
          selectedModel={selectedModel}
          onModelSelect={onModelSelect}
          isExpanded={true}
          credits={credits}
        />

        <div className="flex items-center gap-6 mt-3 text-xs text-gray-400 ml-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
            Include styling requirements if applicable
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
            Mention any specific libraries or dependencies
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="text-center text-xs text-gray-400 mb-4">
        Your code will be generated securely
      </div>
      <div className="flex items-center justify-center gap-4 sm:gap-8">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-[#103B40]">24</span>
          <span className="text-xs text-gray-400 mt-1">Generated</span>
        </div>
        <div className="w-px h-10 bg-gray-200" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-[#103B40]">18</span>
          <span className="text-xs text-gray-400 mt-1">Successful</span>
        </div>
        <div className="w-px h-10 bg-gray-200" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-teal-600">75%</span>
          <span className="text-xs text-gray-400 mt-1">Success Rate</span>
        </div>
      </div>
    </div>
  );
}
