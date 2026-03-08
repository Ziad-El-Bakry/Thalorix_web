import React from "react";
import { MessageBubbleProps } from "../../../types/message";

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
        className={`max-w-[60%] px-3 py-2 rounded-lg relative ${
          isOwn
            ? "bg-teal-800 text-white rounded-tr-none"
            : "bg-gray-200 text-gray-800 rounded-tl-none"
        }`}
      >
        <p className="text-sm" style={{ wordBreak: "break-word" }}>
          {message.text}
        </p>
        <span
          className={`text-[10px] absolute bottom-1 right-2 ${isOwn ? "text-white" : "text-gray-700"}`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {isOwn && message.status === "failed" && (
          <span className="text-[10px] text-red-500 absolute bottom-1 left-2">
            Failed
          </span>
        )}
      </div>
    </div>
  );
}
