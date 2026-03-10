import React from "react";
import { ChatList, ChatWindow } from "../../../components/features/messages";

export default function Messages() {
  return (
    // container fills available space and negates parent padding so chat spans edge-to-edge
        <div className="flex flex-row flex-1 h-[calc(100vh-60px)] md:h-[calc(100vh-60px)] lg:h-[100vh] w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] lg:w-[calc(100%+5rem)] overflow-hidden -mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10">
                <ChatList />
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <ChatWindow />
      </div>
    </div>
  );
}
