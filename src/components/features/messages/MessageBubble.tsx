import React from "react";
import { MessageBubbleProps } from "../../../types/message";
import { Check, CheckCheck } from "lucide-react";

export default function MessageBubble({
  message,
  isOwn = false,
}: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      {!isOwn && (
        <img
          src={message.sender.avatarUrl || "/images/default-avatar.png"}
          alt={message.sender.name}
          className="w-8 h-8 rounded-full mr-2 object-cover"
        />
      )}
      <div
        className={`max-w-[60%] px-3 py-2 pb-7 rounded-lg relative min-w-[100px] ${
          isOwn
            ? "bg-teal-800 text-white rounded-tr-none"
            : "bg-gray-200 text-gray-800 rounded-tl-none"
        }`}
      >
        <p className="text-sm" style={{ wordBreak: "break-word" }}>
          {message.text}
        </p>

        {/* Timing and Status styled as a pill/button */}
        <div className="flex items-center gap-1 absolute bottom-1 right-1.5">
          {isOwn && message.status === "failed" && (
            <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-medium shadow-sm">
              Failed
            </span>
          )}
          <span
            className={`text-[10px] flex items-center gap-1 px-1.5 py-0.5 rounded-full font-medium shadow-sm ${
              isOwn ? "bg-black/20 text-white" : "bg-black/10 text-gray-700"
            }`}
          >
            <span>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {isOwn && message.status === "sent" && (
              <Check className="w-3 h-3 text-white/70" />
            )}
            {isOwn && message.status === "delivered" && (
              <CheckCheck className="w-3 h-3 text-white/70" />
            )}
            {isOwn && message.status === "read" && (
              <CheckCheck className="w-3 h-3 text-blue-400" />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
