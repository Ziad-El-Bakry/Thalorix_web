"use client";

import React, { useState, useRef } from "react";
import { Paperclip, Mic, Send, Image as ImageIcon, FileText, Archive, Camera, Square } from "lucide-react";

export default function MessageInput({ value, onChange, onSend }: any) {
  const [showAttachments, setShowAttachments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleAttachmentClick = (type: string) => {
    if (!fileInputRef.current) return;
    
    // Reset attributes first
    fileInputRef.current.removeAttribute('capture');
    fileInputRef.current.removeAttribute('accept');
    
    if (type === 'camera') {
      fileInputRef.current.setAttribute('accept', 'image/*');
      fileInputRef.current.setAttribute('capture', 'environment');
    } else if (type === 'images') {
      fileInputRef.current.setAttribute('accept', 'image/png, image/jpeg, image/webp, image/gif');
    } else if (type === 'pdf') {
      fileInputRef.current.setAttribute('accept', '.pdf,application/pdf');
    } else if (type === 'zip') {
      fileInputRef.current.setAttribute('accept', '.zip,application/zip,application/x-zip-compressed');
    } else {
      fileInputRef.current.setAttribute('accept', '*/*');
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
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onSend(audioUrl, "audio"); // إرسال الصوت كنوع audio
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (err) {
      alert("يرجى السماح بالوصول للميكروفون");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      let type: any = 'file';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) type = 'pdf';
      else if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed' || file.name.endsWith('.zip')) type = 'zip';
      
      onSend(url, type, file.name);
    }
  };

  return (
    <div className="flex items-center px-4 py-3 bg-[#004d40] sticky bottom-0 z-10 w-full border-t border-teal-900/50 relative">
      {showAttachments && (
        <div className="absolute bottom-[110%] left-6 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-56 animate-in fade-in zoom-in-95 slide-in-from-bottom-5 duration-200">
          <AttachmentOption icon={<Camera className="w-5 h-5 text-indigo-500" />} label="Camera" onClick={() => handleAttachmentClick('camera')} />
          <AttachmentOption icon={<ImageIcon className="w-5 h-5 text-blue-500" />} label="Photos & Videos" onClick={() => handleAttachmentClick('images')} />
          <AttachmentOption icon={<FileText className="w-5 h-5 text-rose-500" />} label="PDF Document" onClick={() => handleAttachmentClick('pdf')} />
          <AttachmentOption icon={<Archive className="w-5 h-5 text-amber-500" />} label="Zip Archive" onClick={() => handleAttachmentClick('zip')} hideBorder={true} />
        </div>
      )}

      <div className={`flex-1 flex items-center rounded-full px-4 py-2 mr-3 bg-[#00695c] border border-[#00796b]`}>
        {!isRecording ? (
          <>
            <button onClick={() => setShowAttachments(!showAttachments)} className="text-gray-300 hover:text-white mr-2">
              <Paperclip className={`w-5 h-5 transition-transform ${showAttachments ? 'rotate-45' : 'rotate-[135deg]'}`} />
            </button>
            <input
              type="text"
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
              placeholder="Your message"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && value.trim() && onSend(value, "text")}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center gap-3">
            <Mic className="w-5 h-5 text-red-500 animate-pulse" />
            <span className="text-sm font-medium text-white">
              {Math.floor(recordingTime/60)}:{(recordingTime%60).toString().padStart(2,'0')}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isRecording ? (
          <button onClick={stopRecording} className="p-2 bg-red-500 text-white rounded-full"><Square size={18} fill="white" /></button>
        ) : (
          <button onClick={startRecording} className="p-2 text-gray-300 hover:text-white"><Mic className="w-5 h-5" /></button>
        )}
        {!isRecording && (
          <button onClick={() => onSend(value, "text")} disabled={!value.trim()} className="p-2 text-white disabled:opacity-30"><Send className="w-5 h-5" /></button>
        )}
      </div>
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
    </div>
  );
}

function AttachmentOption({ icon, label, onClick, hideBorder }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`flex items-center gap-4 w-full px-5 py-4 text-[15px] text-gray-700 hover:bg-gray-50/80 active:bg-gray-100 transition-colors ${!hideBorder ? 'border-b border-gray-50' : ''}`}
    >
      <div className="bg-gray-50 p-2 rounded-full border border-gray-100/50 shadow-sm">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </button>
  );
}