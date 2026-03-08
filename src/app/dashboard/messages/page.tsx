import React from "react";
import { ChatList, ChatWindow } from "../../../components/features/messages";

export default function Messages() {
  return (
    // container fills available space and negates parent padding so chat spans edge-to-edge
    <div className="flex flex-col md:flex-row flex-1 h-[calc(100vh-120px)] md:h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] lg:w-[calc(100%+5rem)] overflow-hidden -mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10">
      <ChatList />
      <div className="flex-1 overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  );
}
