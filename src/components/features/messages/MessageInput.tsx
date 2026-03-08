import React from "react";
import { MessageInputProps } from "../../../types/message";
import { Paperclip, Mic, Send } from "lucide-react";

export default function MessageInput({
  value,
  onChange,
  onSend,
}: MessageInputProps) {
  return (
    <div className="flex items-center p-3 border-t bg-teal-800 sticky bottom-0 z-10">
      <Paperclip className="w-5 h-5 text-white cursor-pointer" />
      <input
        type="text"
        className="flex-1 mx-3 px-3 py-2 bg-teal-700 text-white rounded-full focus:outline-none placeholder-gray-300"
        placeholder="Your message"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <Mic className="w-5 h-5 text-white cursor-pointer" />
      <button onClick={onSend} className="ml-3">
        <Send className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
