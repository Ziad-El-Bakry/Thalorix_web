import React from "react";
import { ChatList, ChatWindow } from "../../../components/features/messages";

export default function Messages() {
  return (
    // container fills available space and negates parent padding so chat spans edge-to-edge
    <div className="flex flex-1 h-full w-full overflow-hidden -mx-6 md:-mx-10">
      <ChatList />
      <ChatWindow />
    </div>
  );
}
