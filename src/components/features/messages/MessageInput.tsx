"use client";

import React, { useState, useRef } from "react";
import { Paperclip, Send, Image as ImageIcon, FileText, Archive, Square, X, Loader2 } from "lucide-react";
import { uploadService } from "@/lib/api/services/upload.service";
import { useChatStore } from "@/store/useChatStore";

export default function MessageInput({ value, onChange, onSend, replyingTo, onCancelReply, receiverId }: any) {
  const [showAttachments, setShowAttachments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { sendMediaMessage, sendTyping } = useChatStore();

  const handleInputChange = (val: string) => {
    onChange(val);
    
    // Debounce typing (Fix 7)
    if (!typingTimeoutRef.current && val.trim().length > 0) {
      sendTyping(receiverId, true);
    }
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(receiverId, false);
      typingTimeoutRef.current = null;
    }, 500);
  };

  React.useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  const handleAttachmentClick = (type: string) => {
    if (!fileInputRef.current) return;
    fileInputRef.current.removeAttribute("capture");
    fileInputRef.current.removeAttribute("accept");
    if (type === "images") {
      fileInputRef.current.setAttribute("accept", "image/png, image/jpeg, image/webp, image/gif");
    } else if (type === "pdf") {
      fileInputRef.current.setAttribute("accept", ".pdf,application/pdf");
    } else if (type === "zip") {
      fileInputRef.current.setAttribute("accept", ".zip,application/zip,application/x-zip-compressed");
    } else {
      fileInputRef.current.setAttribute("accept", "*/*");
    }
    fileInputRef.current.click();
    setShowAttachments(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        setIsUploading(true);
        const blob = new Blob(chunks, { type: "audio/webm" });
        try {
          // Upload audio with optimistic UI
          setIsUploading(true); // Small indicator for audio
          sendMediaMessage(receiverId, blob, "audio", "Voice Message", replyingTo?.id);
        } catch (error) {
          console.error("Failed to upload audio:", error);
          alert("Failed to upload audio message.");
        } finally {
          setIsUploading(false);
          stream.getTracks().forEach((t) => t.stop());
        }
      };
      mediaRecorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => setRecordingTime((p) => p + 1), 1000);
    } catch {
      alert("Please allow microphone access");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setRecordingTime(0);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Fix 8: Strict Validation Frontend
    const forbiddenExts = /\.(exe|bat|cmd|ps1|js|sh)$/i;
    if (forbiddenExts.test(file.name)) {
      alert("This file type is not allowed for security reasons.");
      e.target.value = "";
      return;
    }
    
    let type: any = "file";
    if (file.type.startsWith("image/")) type = "image";
    else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) type = "pdf";
    else if (file.type.includes("zip") || file.name.endsWith(".zip")) type = "zip";
    
    // Optimistic Upload Flow
    sendMediaMessage(receiverId, file, type, file.name, replyingTo?.id);
    onCancelReply();
    e.target.value = "";
  };

  const fmtTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="flex items-end px-3 py-2.5 bg-[#103B40] sticky bottom-0 z-10 w-full border-t border-white/10 gap-2 relative" style={{ boxShadow: "0 -8px 24px rgba(0,0,0,0.3)" }}>

      {/* Replying To Preview */}
      {replyingTo && (
        <div className="absolute bottom-full left-0 right-0 bg-[#103B40] px-3 pb-2 pt-1 border-t border-white/10 animate-in slide-in-from-bottom-2 fade-in">
          <div className="bg-[#1a4f55] rounded-xl p-2.5 flex items-center gap-3 border-l-4 border-l-[#9EC8FF]">
            <div className="flex-1 min-w-0">
              <span className="text-teal-200 text-xs font-semibold">Replying to {replyingTo.sender?.name || "User"}</span>
              <p className="text-white text-sm truncate opacity-90 mt-0.5">
                {replyingTo.text || 
                 (replyingTo.imageUrl ? "Photo" : 
                 replyingTo.fileUrl ? "Document" : 
                 replyingTo.audioUrl ? "Voice message" : "Message")}
              </p>
            </div>
            <button 
              onClick={onCancelReply}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Attachment Menu */}
      {showAttachments && (
        <div className="absolute bottom-[calc(100%+6px)] left-3 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden w-52 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-150">
          <AttachmentOption icon={<ImageIcon className="w-4.5 h-4.5 text-blue-500" />} label="Photos & Videos" onClick={() => handleAttachmentClick("images")} />
          <AttachmentOption icon={<FileText className="w-4.5 h-4.5 text-rose-500" />} label="PDF Document" onClick={() => handleAttachmentClick("pdf")} />
          <AttachmentOption icon={<Archive className="w-4.5 h-4.5 text-amber-500" />} label="Zip Archive" onClick={() => handleAttachmentClick("zip")} hideBorder />
        </div>
      )}

      {/* Input Area */}
      <div className="flex-1 flex items-center rounded-2xl bg-[#1a4f55] border border-white/10 px-3 py-2 gap-2 min-h-[44px]">
        {!isRecording ? (
          <>
            <button
              onClick={() => setShowAttachments(!showAttachments)}
              className="text-white/60 hover:text-white transition-colors flex-shrink-0"
            >
              <Paperclip
                className={`w-5 h-5 transition-transform duration-200 ${showAttachments ? "rotate-45" : "rotate-[135deg]"}`}
              />
            </button>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
              placeholder={isUploading ? "Uploading..." : "Your message..."}
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && value.trim() && !isUploading && onSend(value, "text")}
              disabled={isUploading}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center gap-3">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white tabular-nums">{fmtTime(recordingTime)}</span>
            <span className="text-xs text-white/50">Recording...</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {isUploading ? (
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
             <Loader2 className="w-4.5 h-4.5 text-white animate-spin" />
          </div>
        ) : isRecording ? (
          <button
            onClick={stopRecording}
            className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
          >
            <Square className="w-4 h-4 fill-white" />
          </button>
        ) : (
          <>

            {value.trim() && (
              <button
                onClick={() => onSend(value, "text")}
                className="w-10 h-10 bg-white text-[#103B40] hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors shadow-sm"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            )}
          </>
        )}
      </div>

      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
    </div>
  );
}

function AttachmentOption({
  icon,
  label,
  onClick,
  hideBorder,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  hideBorder?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 transition-colors ${
        !hideBorder ? "border-b border-gray-50 dark:border-gray-800" : ""
      }`}
    >
      <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-full border border-gray-100 dark:border-gray-700 shrink-0">{icon}</div>
      <span className="font-medium">{label}</span>
    </button>
  );
}