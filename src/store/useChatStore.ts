import { create } from "zustand";
import { socketService } from "@/lib/api/services/socket.service";
import { chatService } from "@/lib/api/services/chat.service";
import { authService } from "@/lib/api/services/auth.service";
import { Conversation, Message } from "@/types/message";

interface ChatStore {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // conversationId -> messages
  activeConversationId: string | null;
  socketConnected: boolean;
  isTyping: Record<string, boolean>; // userId -> isTyping
  offlineQueue: any[]; // Stored offline messages
  
  // Actions
  init: () => void;
  cleanup: () => void;
  setActiveConversation: (id: string | null) => void;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string, page?: number) => Promise<void>;
  sendMessage: (receiverId: string, content: string, type?: string) => void;
  sendTyping: (receiverId: string, isTyping: boolean) => void;
  markAsRead: (conversationId: string) => void;
}

const mapBackendMessage = (msg: any): Message => ({
  id: msg._id,
  sender: {
    id: msg.sender._id || msg.sender,
    name: msg.sender.name || "User",
    avatarUrl: msg.sender.avatar || "/images/avatar.png",
  },
  text: msg.content,
  timestamp: msg.createdAt,
  status: msg.isRead ? "read" : "delivered",
});

const mapBackendConversation = (conv: any, currentUserId: string): Conversation => {
  const otherUser = conv.participants.find((p: any) => p._id !== currentUserId) || conv.participants[0];
  return {
    id: conv._id,
    participants: [{
      id: otherUser._id,
      name: otherUser.name || "User",
      avatarUrl: otherUser.avatar || "/images/avatar.png",
      online: false, // We'll update this via socket later
    }],
    messages: [], // Loaded separately
    lastMessage: conv.lastMessage ? mapBackendMessage(conv.lastMessage) : undefined,
    unreadCount: conv.unreadCount || 0,
    updatedAt: conv.updatedAt,
  };
};

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  messages: {},
  activeConversationId: null,
  socketConnected: false,
  isTyping: {},
  offlineQueue: [],

  init: () => {
    const socket = socketService.connect();
    if (!socket) return;

    // Load offline queue from localStorage
    try {
      const storedQueue = localStorage.getItem("chat_offline_queue");
      if (storedQueue) {
        set({ offlineQueue: JSON.parse(storedQueue) });
      }
    } catch (e) {}

    socket.on("connect", () => {
      set({ socketConnected: true });
      // Flush offline queue
      const queue = get().offlineQueue;
      if (queue.length > 0) {
        queue.forEach(msg => {
          socket.emit("send_message", { receiverId: msg.receiverId, content: msg.content });
        });
        set({ offlineQueue: [] });
        localStorage.removeItem("chat_offline_queue");
      }
    });

    socket.on("disconnect", () => {
      set({ socketConnected: false });
    });

    socket.on("receive_message", (payload: any) => {
      const msg = mapBackendMessage(payload);
      const convId = payload.conversation;

      set((state) => {
        // Add message to messages list
        const convMessages = state.messages[convId] || [];
        // Deduplication
        if (convMessages.some(m => m.id === msg.id)) return state;

        const updatedMessages = {
          ...state.messages,
          [convId]: [...convMessages, msg]
        };

        // Update conversation list
        let updatedConvs = [...state.conversations];
        const convIndex = updatedConvs.findIndex(c => c.id === convId);
        
        if (convIndex > -1) {
          const conv = updatedConvs[convIndex];
          conv.lastMessage = msg;
          conv.updatedAt = msg.timestamp;
          if (state.activeConversationId !== convId) {
            conv.unreadCount = (conv.unreadCount || 0) + 1;
          }
          // Move to top
          updatedConvs.splice(convIndex, 1);
          updatedConvs.unshift(conv);
        } else {
          // If conversation doesn't exist in list, reload conversations
          get().loadConversations();
        }

        // If chat is active, mark read automatically
        if (state.activeConversationId === convId) {
          socket.emit("mark_read", { conversationId: convId });
        }

        return { messages: updatedMessages, conversations: updatedConvs };
      });
    });

    socket.on("message_sent", (payload: any) => {
      // Backend confirmation that message was sent
      const msg = mapBackendMessage(payload);
      const convId = payload.conversation;
      
      set((state) => {
        const convMessages = state.messages[convId] || [];
        // Find optimistic message and replace/update it
        const updatedMsgs = convMessages.map(m => 
          m.status === "sending" && m.text === msg.text ? { ...m, id: msg.id, status: "sent" as const } : m
        );
        return {
          messages: { ...state.messages, [convId]: updatedMsgs }
        };
      });
    });

    socket.on("user_typing", ({ userId }) => {
      set((state) => ({ isTyping: { ...state.isTyping, [userId]: true } }));
      // Auto clear after 3s
      setTimeout(() => {
        set((state) => ({ isTyping: { ...state.isTyping, [userId]: false } }));
      }, 3000);
    });

    socket.on("user_stopped_typing", ({ userId }) => {
      set((state) => ({ isTyping: { ...state.isTyping, [userId]: false } }));
    });
  },

  cleanup: () => {
    socketService.disconnect();
    set({ socketConnected: false });
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
    if (id) {
      get().markAsRead(id);
    }
  },

  loadConversations: async () => {
    try {
      const data = await chatService.getConversations();
      const currentUser = authService.getStoredUser();
      const currentUserId = currentUser?.id || "current_user_id";
      const parsed = data.map((c: any) => mapBackendConversation(c, currentUserId));
      set({ conversations: parsed });
    } catch (e) {
      console.error("Failed to load conversations", e);
    }
  },

  loadMessages: async (conversationId, page = 1) => {
    try {
      const data = await chatService.getMessages(conversationId, page);
      const msgs = data.map(mapBackendMessage).reverse(); // Reverse because API returns newest first (descending)
      
      set((state) => {
        const existing = state.messages[conversationId] || [];
        // If page 1, replace. Otherwise prepend
        const updated = page === 1 ? msgs : [...msgs, ...existing];
        // Deduplicate
        const unique = updated.filter(
          (msg: Message, index: number, self: Message[]) => self.findIndex((m: Message) => m.id === msg.id) === index
        );
        
        return {
          messages: { ...state.messages, [conversationId]: unique }
        };
      });
    } catch (e) {
      console.error("Failed to load messages", e);
    }
  },

  sendMessage: (receiverId, content, type = "text") => {
    const socket = socketService.getSocket();
    const state = get();
    
    // Find conversation ID
    const conv = state.conversations.find(c => c.participants[0].id === receiverId);
    const convId = conv?.id || `temp_${Date.now()}`; // Handle optimistic new conv

    const optimisticMsg: Message = {
      id: `opt_${Date.now()}`,
      sender: { id: "me", name: "Me" }, // Will be fixed by backend
      text: content,
      timestamp: new Date().toISOString(),
      status: "sending"
    };

    // Optimistically add to UI
    set((state) => {
      const existing = state.messages[convId] || [];
      return {
        messages: { ...state.messages, [convId]: [...existing, optimisticMsg] }
      };
    });

    if (state.socketConnected && socket) {
      socket.emit("send_message", { receiverId, content });
    } else {
      // Queue for offline
      const newQueue = [...state.offlineQueue, { receiverId, content, optimisticId: optimisticMsg.id }];
      set({ offlineQueue: newQueue });
      localStorage.setItem("chat_offline_queue", JSON.stringify(newQueue));
      
      // Update status to queued
      set((state) => {
        const existing = state.messages[convId] || [];
        return {
          messages: {
            ...state.messages,
            [convId]: existing.map(m => m.id === optimisticMsg.id ? { ...m, status: "failed" } : m)
          }
        };
      });
    }
  },

  sendTyping: (receiverId, isTyping) => {
    const socket = socketService.getSocket();
    if (!socket || !get().socketConnected) return;
    
    if (isTyping) {
      socket.emit("typing", { receiverId });
    } else {
      socket.emit("stop_typing", { receiverId });
    }
  },

  markAsRead: (conversationId) => {
    const socket = socketService.getSocket();
    if (socket && get().socketConnected) {
      socket.emit("mark_read", { conversationId });
    }
    
    // Optimistic update unread count
    set((state) => ({
      conversations: state.conversations.map(c => 
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      )
    }));
  }
}));
