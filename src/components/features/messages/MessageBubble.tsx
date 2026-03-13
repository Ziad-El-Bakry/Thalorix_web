import React, { useState, useRef, useEffect } from "react";
import { CheckCheck, FileText, Archive, Download, Play, Pause, Volume2, MoreVertical } from "lucide-react";

export default function MessageBubble({ message, isOwn = false, onImageClick }: any) {
  // دالة لتحميل الملف عند النقر
  const handleFileDownload = () => {
    if (!message.fileUrl) return;
    const a = document.createElement("a");
    a.href = message.fileUrl;
    a.download = message.fileName || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  // دالة لتحديد شكل عرض الملف بناءً على نوعه
  const renderFileContent = () => {
    if (message.imageUrl) {
      return (
        <div 
          className="relative group cursor-pointer mb-2"
          onClick={() => onImageClick && onImageClick(message.imageUrl)}
        >
          <img
            src={message.imageUrl}
            alt="Sent content"
            className="rounded-lg max-w-full h-auto border border-black/5 max-h-[300px] object-cover"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
            <Download className="text-white w-6 h-6" />
          </div>
        </div>
      );
    }

    if (message.fileType === 'pdf') {
      return (
        <div 
          className="flex items-center gap-3 p-3 bg-black/10 rounded-lg border border-black/5 min-w-[200px] mb-3 cursor-pointer hover:bg-black/20 transition-colors"
          onClick={handleFileDownload}
        >
          <div className="bg-red-500 p-2 rounded-lg shrink-0">
            <FileText className="text-white w-6 h-6" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{message.fileName || "Document.pdf"}</p>
            <p className="text-[10px] opacity-70 uppercase">PDF File</p>
          </div>
          <Download className="w-4 h-4 opacity-70 shrink-0" />
        </div>
      );
    }

    if (message.fileType === 'zip') {
      return (
        <div 
          className="flex items-center gap-3 p-3 bg-black/10 rounded-lg border border-black/5 min-w-[200px] mb-3 cursor-pointer hover:bg-black/20 transition-colors"
          onClick={handleFileDownload}
        >
          <div className="bg-yellow-600 p-2 rounded-lg shrink-0">
            <Archive className="text-white w-6 h-6" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{message.fileName || "Archive_files.zip"}</p>
            <p className="text-[10px] opacity-70 uppercase">Zip Archive</p>
          </div>
          <Download className="w-4 h-4 opacity-70 shrink-0" />
        </div>
      );
    }

    if (message.audioUrl) {
      return <CustomAudioPlayer src={message.audioUrl} />;
    }

    return <p className="text-sm leading-relaxed pr-14 pb-1.5" style={{ wordBreak: "break-word" }}>{message.text}</p>;
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4 gap-2 animate-in fade-in slide-in-from-bottom-1`}>
      {!isOwn && (
        <img
          src={message.sender?.avatarUrl || "/images/avatar.png"}
          alt={message.sender?.name || "User"}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-auto"
        />
      )}
      
      <div className="flex flex-col">
        <div className={`max-w-[100%] sm:max-w-[320px] md:max-w-[400px] w-fit min-w-[120px] p-3 pb-4 text-left rounded-2xl relative shadow-sm ${
          isOwn 
            ? message.status === 'failed' ? "bg-[#ffdcdc] text-black" : "bg-[#164e46] text-white"
            : "bg-[#e5e7e8] text-gray-800"
        }`}>
          
          <div>
            {renderFileContent()}
          </div>

          <div className="flex items-center gap-1 absolute bottom-1.5 right-2.5">
            <span className={`text-[10px] ${isOwn && message.status !== 'failed' ? 'opacity-70 text-gray-200' : 'opacity-60 text-gray-700'}`}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
            </span>
            {isOwn && message.status !== 'failed' && (
              <CheckCheck className={`w-3.5 h-3.5 ${message.status === 'read' ? 'text-blue-400' : 'text-white/70'}`} />
            )}
            {isOwn && message.status === 'failed' && (
              <CheckCheck className="w-3.5 h-3.5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Failed Status Area */}
        {isOwn && message.status === 'failed' && (
          <div className="flex items-center gap-1 justify-end mt-1 text-[11px] font-medium">
            <span className="text-red-500">Failed</span>
            <button className="flex items-center gap-1 text-teal-700 hover:text-teal-900 transition-colors ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Retry
            </button>
          </div>
        )}
      </div>

      {isOwn && (
        <img
          src={message.sender?.avatarUrl || "/images/avatar.png"}
          alt="My Avatar"
          className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-auto"
        />
      )}
    </div>
  );
}

function CustomAudioPlayer({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    }
  }, [src]);

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  };

  const calculateProgress = () => {
    if (!duration) return 0;
    return (currentTime / duration) * 100;
  };

  return (
    <div className="flex items-center bg-[#f0f2f5] rounded-full px-4 py-2 mb-3 mt-1 shadow-sm w-full sm:w-[320px] gap-3">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button onClick={togglePlayPause} className="text-gray-800 focus:outline-none flex-shrink-0 hover:text-gray-600 transition-colors">
        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
      </button>
      
      <span className="text-[13px] text-gray-700 font-medium min-w-[70px] shrink-0 text-center">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
      
      <div className="flex-1 bg-gray-300 rounded-full h-1.5 relative cursor-pointer overflow-hidden">
        <div className="bg-[#164e46] h-full rounded-full transition-all duration-100 ease-linear" style={{ width: `${calculateProgress()}%` }}></div>
      </div>
      
      <button className="text-gray-800 focus:outline-none flex-shrink-0 hover:text-gray-600 transition-colors ml-1">
        <Volume2 className="w-5 h-5" />
      </button>
      <button className="text-gray-800 focus:outline-none flex-shrink-0 hover:text-gray-600 transition-colors">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  );
}
