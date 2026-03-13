import React, { useState, useRef, useEffect } from "react";
import { CheckCheck, FileText, Archive, Download, Play, Pause, Volume2, MoreVertical } from "lucide-react";

export default function MessageBubble({ message, isOwn = false, onImageClick }: any) {
  const handleFileDownload = () => {
    if (!message.fileUrl) return;
    const a = document.createElement("a");
    a.href = message.fileUrl;
    a.download = message.fileName || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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

    return (
      <p className="text-sm leading-relaxed pr-14 pb-1" style={{ wordBreak: "break-word" }}>
        {message.text}
      </p>
    );
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2 gap-2 animate-in fade-in slide-in-from-bottom-1`}>
      {!isOwn && (
        <img
          src={message.sender?.avatarUrl || "/images/avatar.png"}
          alt={message.sender?.name || "User"}
          className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-auto mb-1 ring-1 ring-black/5"
        />
      )}

      <div className="flex flex-col max-w-[80%] sm:max-w-[340px] md:max-w-[420px]">
        <div
          className={`w-fit min-w-[100px] p-3 pb-5 relative shadow-sm ${isOwn
              ? message.status === "failed"
                ? "bg-red-50 text-black rounded-2xl rounded-tr-sm"
                : "bg-[#005c4b] text-white rounded-2xl rounded-tr-sm"
              : "bg-white text-gray-800 rounded-2xl rounded-tl-sm"
            }`}
        >
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
      </div>

      {isOwn && (
        <img
          src={message.sender?.avatarUrl || "/images/avatar.png"}
          alt="Me"
          className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-auto mb-1 ring-1 ring-black/5"
        />
      )}
    </div>
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