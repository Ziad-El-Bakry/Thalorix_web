import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { CheckCheck, FileText, Archive, Download, Play, Pause, Volume2, Reply } from "lucide-react";
import MessageContextMenu from "./MessageContextMenu";

export default function MessageBubble({ message, isOwn = false, onImageClick, onReply }: any) {
  const handleFileDownload = () => {
    if (!message.fileUrl) return;
    const a = document.createElement("a");
    a.href = message.fileUrl;
    a.download = message.fileName || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default browser context menu
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent starting a long press if already open
    if (contextMenu) return;
      
    // Save touch coordinates
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    touchTimerRef.current = setTimeout(() => {
      setContextMenu({ x, y });
    }, 500); // 500ms long press threshold
  };

  const handleTouchEndOrMove = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  const controls = useAnimation();
  const [showSwipeIcon, setShowSwipeIcon] = useState(false);

  const handleDragEnd = (event: any, info: any) => {
    // If swiped right past the 50px threshold
    if (info.offset.x > 50) {
      if (onReply) onReply(message);
    }
    // Snap back to original position
    controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } });
    setShowSwipeIcon(false);
  };

  const handleDrag = (event: any, info: any) => {
    setShowSwipeIcon(info.offset.x > 30);
  };

  const handleMenuReply = () => {
    if (onReply) onReply(message);
  };

  const onSelect = () => console.log("Select message:", message.id);
  const onDelete = () => console.log("Delete message:", message.id);

  const renderContent = () => {
    if (message.imageUrl) {
      return (
        <div
          className="relative group cursor-pointer mb-1"
          onClick={() => onImageClick && onImageClick(message.imageUrl)}
        >
          <img
            src={message.imageUrl}
            alt="Sent image"
            className="rounded-xl max-w-full h-auto border border-black/5 max-h-[280px] object-cover w-full"
          />
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <Download className="text-white w-5 h-5" />
            </div>
          </div>
        </div>
      );
    }

    if (message.fileType === "pdf") {
      return (
        <div
          className="flex items-center gap-3 p-3 bg-black/10 rounded-xl border border-black/5 min-w-[200px] mb-2 cursor-pointer hover:bg-black/15 active:bg-black/20 transition-colors"
          onClick={handleFileDownload}
        >
          <div className="bg-red-500 p-2 rounded-lg shrink-0 shadow-sm">
            <FileText className="text-white w-5 h-5" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate leading-tight">{message.fileName || "Document.pdf"}</p>
            <p className="text-[11px] opacity-60 uppercase mt-0.5 font-medium tracking-wide">PDF · Tap to download</p>
          </div>
          <Download className="w-4 h-4 opacity-50 shrink-0" />
        </div>
      );
    }

    if (message.fileType === "zip") {
      return (
        <div
          className="flex items-center gap-3 p-3 bg-black/10 rounded-xl border border-black/5 min-w-[200px] mb-2 cursor-pointer hover:bg-black/15 active:bg-black/20 transition-colors"
          onClick={handleFileDownload}
        >
          <div className="bg-amber-500 p-2 rounded-lg shrink-0 shadow-sm">
            <Archive className="text-white w-5 h-5" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate leading-tight">{message.fileName || "Archive.zip"}</p>
            <p className="text-[11px] opacity-60 uppercase mt-0.5 font-medium tracking-wide">ZIP · Tap to download</p>
          </div>
          <Download className="w-4 h-4 opacity-50 shrink-0" />
        </div>
      );
    }

    if (message.audioUrl) {
      return <CustomAudioPlayer src={message.audioUrl} isOwn={isOwn} />;
    }

    const renderTextWithLinks = (text: string) => {
      if (!text) return null;
      // Basic regex for URLs
      const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
      const parts = text.split(urlRegex);
      
      return parts.map((part, i) => {
        if (part.match(urlRegex)) {
          const href = part.startsWith('http') ? part : `https://${part}`;
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline hover:opacity-80 transition-opacity break-all font-medium ${isOwn ? (message.status === "failed" ? "text-red-700" : "text-white") : "text-teal-600"}`}
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      });
    };

    return (
      <p className="text-sm leading-relaxed pr-14 pb-1" style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
        {renderTextWithLinks(message.text)}
      </p>
    );
  };

  return (
    <>
      <div 
        className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2 gap-2 animate-in fade-in slide-in-from-bottom-1 relative overflow-hidden`}
      >
      {/* Swipe Reply Icon Indicator (renders behind the bubble) */}
      <div 
        className={`absolute inset-y-0 left-0 flex items-center pl-4 transition-opacity duration-200 ${showSwipeIcon && !isOwn ? "opacity-100" : "opacity-0"}`}
        style={{ zIndex: 0 }}
      >
        <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
          <Reply className="w-4 h-4 text-gray-500" />
        </div>
      </div>
      
      {!isOwn && (
        <img
          src={message.sender?.avatarUrl || "/images/avatar.png"}
          alt={message.sender?.name || "User"}
          className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-auto mb-1 ring-1 ring-black/5 z-10"
        />
      )}

      <motion.div 
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="flex flex-col max-w-[80%] sm:max-w-[340px] md:max-w-[420px] z-10"
      >
        <div
          onContextMenu={handleContextMenu}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEndOrMove}
          onTouchMove={handleTouchEndOrMove}
          className={`w-fit min-w-[100px] p-3 pb-5 relative shadow-sm cursor-pointer hover:brightness-[0.98] transition-all ${isOwn
              ? message.status === "failed"
                ? "bg-red-50 text-black rounded-2xl rounded-tr-sm"
                : "bg-[#005c4b] text-white rounded-2xl rounded-tr-sm"
              : "bg-white text-gray-800 rounded-2xl rounded-tl-sm"
            }`}
        >
          {/* Quoted Reply Block */}
          {message.replyToMessage && (
            <div className={`mb-2 p-2 rounded-lg border-l-4 text-xs ${isOwn ? 'bg-black/10 border-white/50' : 'bg-gray-100 border-teal-500'}`}>
              <span className={`font-semibold block mb-0.5 ${isOwn ? 'text-teal-100' : 'text-teal-700'}`}>
                {message.replyToMessage.sender?.id === "1" ? "You" : message.replyToMessage.sender?.name}
              </span>
              <p className={`truncate opacity-90 ${isOwn ? 'text-white' : 'text-gray-600'}`}>
                {message.replyToMessage.text || 
                 (message.replyToMessage.imageUrl ? "Photo" : 
                 message.replyToMessage.fileUrl ? "Document" : 
                 message.replyToMessage.audioUrl ? "Voice message" : "Message")}
              </p>
            </div>
          )}

          {renderContent()}

          <div className="flex items-center gap-1 absolute bottom-1.5 right-2.5">
            <span className={`text-[10px] ${isOwn && message.status !== "failed" ? "text-white/60" : "text-gray-400"}`}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
            {isOwn && message.status !== "failed" && (
              <CheckCheck
                className={`w-3.5 h-3.5 ${message.status === "read" ? "text-blue-400" : "text-white/50"}`}
              />
            )}
            {isOwn && message.status === "failed" && (
              <CheckCheck className="w-3.5 h-3.5 text-gray-400" />
            )}
          </div>
        </div>

        {isOwn && message.status === "failed" && (
          <div className="flex items-center gap-1 justify-end mt-1 text-[11px] font-medium">
            <span className="text-red-500">Failed to send</span>
            <button className="flex items-center gap-1 text-teal-700 hover:text-teal-900 transition-colors ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
              Retry
            </button>
          </div>
        )}
      </motion.div>

      {isOwn && (
        <img
          src={message.sender?.avatarUrl || "/images/avatar.png"}
          alt="Me"
          className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-auto mb-1 ring-1 ring-black/5"
        />
      )}
    </div>
    
      {/* Context Menu Portal render */}
      {contextMenu && (
        <MessageContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onReply={handleMenuReply}
          onSelect={onSelect}
          onDelete={onDelete}
          isOwn={isOwn}
        />
      )}
    </>
  );
}

function CustomAudioPlayer({ src, isOwn }: { src: string; isOwn?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onMeta = () => { setDuration(audio.duration); setCurrentTime(audio.currentTime); };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnd = () => setIsPlaying(false);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [src]);

  const toggle = () => {
    if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); }
    else { audioRef.current?.play(); setIsPlaying(true); }
  };

  const fmt = (s: number) => {
    if (isNaN(s) || !isFinite(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 mb-2 w-full sm:w-[280px] ${isOwn ? "bg-white/10" : "bg-gray-100"}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        onClick={toggle}
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isOwn ? "bg-white/20 hover:bg-white/30 text-white" : "bg-teal-600 hover:bg-teal-700 text-white"
          }`}
      >
        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className={`w-full rounded-full h-1.5 relative cursor-pointer overflow-hidden ${isOwn ? "bg-white/20" : "bg-gray-300"}`}>
          <div
            className={`h-full rounded-full transition-all ${isOwn ? "bg-white/80" : "bg-teal-600"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={`text-[11px] tabular-nums ${isOwn ? "text-white/60" : "text-gray-500"}`}>
          {fmt(currentTime)} / {fmt(duration)}
        </span>
      </div>
      <button className={`flex-shrink-0 transition-colors ${isOwn ? "text-white/60 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}>
        <Volume2 className="w-4 h-4" />
      </button>
    </div>
  );
}