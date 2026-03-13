"use client";

import React, { useState } from "react";
import { ChatList, ChatWindow } from "../../../components/features/messages";
import { Conversation } from "../../../types/message";
import { dummyConversations } from "../../../components/features/messages/ChatList";

export default function Messages() {

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>(dummyConversations);

  const selectedConversation = conversations.find((c) => c.id === selectedChatId);

  return (
    // container fills available space and negates parent padding so chat spans edge-to-edge
    <div className="flex flex-row flex-1 h-[calc(100vh-60px)] md:h-[calc(100vh-60px)] lg:h-[100vh] w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] lg:w-[calc(100%+5rem)] overflow-hidden -mx-4 md:-mx-6 lg:-mx-10 -my-4 md:-my-6 lg:-my-10">

      <div className={`h-full w-full md:w-auto md:flex-shrink-0 ${selectedChatId ? "hidden md:block" : "block"}`}>
        <ChatList
          selectedId={selectedChatId}
          onSelect={setSelectedChatId}
        />
      </div>

      <div className={`flex-1 flex flex-col overflow-hidden h-full ${!selectedChatId ? "hidden md:flex" : "flex"}`}>
        <ChatWindow
          conversation={selectedConversation}
          onBack={() => setSelectedChatId(null)}
        />
      </div>

    </div>
  );
}
