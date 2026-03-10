"use client";

import React, { useState, useRef } from "react";
import { MessageInputProps } from "../../../types/message";
import { 
  Paperclip, 
  Mic, 
  Send, 
  Image as ImageIcon, 
  FileText, 
  Archive, 
  Camera 
} from "lucide-react";

export default function MessageInput({
  value,
  onChange,
  onSend,
}: MessageInputProps) {
  const [showAttachments, setShowAttachments] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAttachmentClick = (type: string) => {
    console.log(`Selecting attachment type: ${type}`);
    
    fileInputRef.current?.click();
    setShowAttachments(false);
  };

  return (
    <div className="flex items-center px-4 py-3 bg-[#004d40] sticky bottom-0 z-10 w-full border-t border-teal-900/50">
      
      
      {showAttachments && (
        <div className="absolute bottom-20 left-6 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden w-52 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <AttachmentOption 
            icon={<Camera className="w-4 h-4 text-purple-500" />} 
            label="Camera" 
            onClick={() => handleAttachmentClick('camera')}
          />
          <AttachmentOption 
            icon={<ImageIcon className="w-4 h-4 text-blue-500" />} 
            label="Images" 
            onClick={() => handleAttachmentClick('images')}
          />
          <AttachmentOption 
            icon={<FileText className="w-4 h-4 text-red-500" />} 
            label="PDF" 
            onClick={() => handleAttachmentClick('pdf')}
          />
          <AttachmentOption 
            icon={<Archive className="w-4 h-4 text-yellow-600" />} 
            label="Zip File" 
            onClick={() => handleAttachmentClick('zip')}
            hideBorder
          />
        </div>
      )}

      {/*   */}
      <div className="flex-1 flex items-center bg-[#00695c] rounded-full px-4 py-2 mr-3 border border-[#00796b]">
        <button
          onClick={() => setShowAttachments(!showAttachments)}
          className={`transition-all duration-200 ${showAttachments ? 'rotate-45 text-white' : 'text-gray-300 hover:text-white'}`}
        >
          <Paperclip className="w-5 h-5 rotate-[135deg]" />
        </button>
        
        <input
          type="text"
          className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm md:text-base px-3"
          placeholder="Your message"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              e.preventDefault();
              onSend();
            }
          }}
        />
      </div>

      
      <div className="flex items-center gap-1">
        <button className="p-2 text-gray-300 hover:text-white transition-colors">
          <Mic className="w-5 h-5" />
        </button>
        <button
          onClick={onSend}
          disabled={!value.trim()}
          className={`p-2 rounded-full transition-all ${
            value.trim()
              ? "text-white scale-110 opacity-100"
              : "text-white/30 cursor-not-allowed opacity-50"
          }`}
        >
          <Send className="w-5 h-5 shadow-sm" />
        </button>
      </div>

      {/* Input مخفي للتعامل مع رفع الملفات فعلياً */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={(e) => {
            const file = e.target.files?.[0];
            if(file) console.log("File selected:", file.name);
        }} 
      />
    </div>
  );
}

// مكون فرعي للأزرار داخل القائمة المنبثقة
function AttachmentOption({ icon, label, onClick, hideBorder = false }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-4 w-full px-5 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left ${!hideBorder ? 'border-b border-gray-100' : ''}`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}