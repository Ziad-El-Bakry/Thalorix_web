import { create } from "zustand";
import { socketService } from "@/lib/api/services/socket.service";
import { authService } from "@/lib/api/services/auth.service";
import { uploadService } from "@/lib/api/services/upload.service";
import { chatService } from "@/lib/api/services/chat.service";
import { useAuthStore } from "@/store/useAuthStore";
import { Conversation, Message } from "@/types/message";

interface ChatStore {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // conversationId -> messages
  activeConversationId: string | null;
  socketConnected: boolean;
  isTyping: Record<string, boolean>; // userId -> isTyping
  offlineQueue: any[]; // Stored offline messages
  replyingTo: Message | null;
  onlineUserIds: string[]; // List of currently online user IDs
  
  // Actions
  init: () => void;
  cleanup: () => void;
  setActiveConversation: (id: string | null) => void;
  setReplyingTo: (msg: Message | null) => void;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string, page?: number) => Promise<void>;
  sendMessage: (receiverId: string, content: string, type?: string, attachmentUrl?: string, replyToId?: string) => void;
  sendMediaMessage: (receiverId: string, file: File | Blob, type: string, fileName?: string, replyToId?: string) => Promise<void>;
  sendTyping: (receiverId: string, isTyping: boolean) => void;
  markAsRead: (conversationId: string) => void;
  deleteMessage: (messageId: string, conversationId: string) => void;
  deleteConversation: (receiverId: string) => void;
}

const mapBackendMessage = (msg: any): Message => ({
  id: msg._id || msg.id,
  sender: {
    id: msg.sender?._id || msg.sender?.id || msg.sender || "unknown",
    name: msg.sender?.name || "User",
    avatarUrl: msg.sender?.avatar || msg.sender?.avatarUrl || msg.sender?.logo || "/images/avatar.png",
  },
  text: msg.content || msg.text,
  timestamp: msg.createdAt || msg.timestamp || new Date().toISOString(),
  status: msg.status || (msg.isRead ? "read" : "delivered"),
  attachmentUrl: msg.attachmentUrl,
  isDeleted: msg.isDeleted,
  replyToMessage: msg.replyTo ? mapBackendMessage(msg.replyTo) : undefined,
});

const mapBackendConversation = (conv: any, currentUserId: string, onlineUserIds: string[] = []): Conversation => {
  const otherUser = conv.participants.find((p: any) => p._id !== currentUserId) || conv.participants[0];
  return {
    id: conv._id,
    participants: [{
      id: otherUser._id,
      name: otherUser.name || "User",
      avatarUrl: otherUser.avatar || otherUser.avatarUrl || otherUser.logo || "/images/avatar.png",
      online: onlineUserIds.includes(otherUser._id),
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
  replyingTo: null,
  onlineUserIds: [],

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
      // Refetch conversations and current active chat on reconnect
      get().loadConversations();
      if (get().activeConversationId) {
        get().loadMessages(get().activeConversationId as string, 1);
      }
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
        
        // Remove any optimistic message with same text that is still 'sending'
        const filteredMsgs = convMessages.filter(m => !(m.status === "sending" && m.text === msg.text));
        
        // Deduplication
        if (filteredMsgs.some(m => m.id === msg.id)) return state;

        const updatedMessages = {
          ...state.messages,
          [convId]: [...filteredMsgs, msg]
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
        
        // If the message is already added by receive_message, just remove the optimistic one
        const alreadyExists = convMessages.some(m => m.id === msg.id);
        
        let updatedMsgs;
        if (alreadyExists) {
          updatedMsgs = convMessages.filter(m => !(m.status === "sending" && m.text === msg.text));
        } else {
          updatedMsgs = convMessages.map(m => 
            m.status === "sending" && m.text === msg.text ? { ...m, id: msg.id, status: "sent" as const } : m
          );
        }

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

    socket.on("message_deleted", ({ messageId, conversationId }) => {
      set((state) => {
        const convMessages = state.messages[conversationId] || [];
        const updatedMsgs = convMessages.map(m => 
          m.id === messageId ? { ...m, isDeleted: true, text: "This message was deleted", attachmentUrl: undefined } : m
        );
        return {
          messages: { ...state.messages, [conversationId]: updatedMsgs }
        };
      });
    });

    socket.on("online_users", (userIds: string[]) => {
      set({ onlineUserIds: userIds });
      set((state) => ({
        conversations: state.conversations.map((c) => {
          const otherParticipant = c.participants[0];
          if (otherParticipant) {
            return {
              ...c,
              participants: [{ ...otherParticipant, online: userIds.includes(otherParticipant.id) }],
            };
          }
          return c;
        }),
      }));
    });

    socket.on("user_status", ({ userId, status }) => {
      set((state) => {
        const currentOnline = [...state.onlineUserIds];
        if (status === "online") {
          if (!currentOnline.includes(userId)) currentOnline.push(userId);
        } else {
          const idx = currentOnline.indexOf(userId);
          if (idx > -1) currentOnline.splice(idx, 1);
        }

        return {
          onlineUserIds: currentOnline,
          conversations: state.conversations.map((c) => {
            const otherParticipant = c.participants[0];
            if (otherParticipant && otherParticipant.id === userId) {
              return {
                ...c,
                participants: [{ ...otherParticipant, online: status === "online" }],
              };
            }
            return c;
          }),
        };
      });
    });
  },

  cleanup: () => {
    socketService.disconnect();
    set({ socketConnected: false });
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id, replyingTo: null });
    if (id) {
      get().markAsRead(id);
    }
  },

  setReplyingTo: (msg) => set({ replyingTo: msg }),

  loadConversations: async () => {
    try {
      const data = await chatService.getConversations();
      const currentUserId = useAuthStore.getState().currentUserId || "current_user_id";
      const onlineUserIds = get().onlineUserIds;
      const parsed = data.map((c: any) => mapBackendConversation(c, currentUserId, onlineUserIds));
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

  sendMessage: (receiverId, content, type = "text", attachmentUrl, replyToId) => {
    const socket = socketService.getSocket();
    const state = get();
    
    // Find conversation ID
    const conv = state.conversations.find(c => c.participants[0].id === receiverId);
    const convId = conv?.id || `temp_${Date.now()}`; // Handle optimistic new conv

    const optimisticMsg: Message = {
      id: `opt_${Date.now()}`,
      sender: { id: useAuthStore.getState().currentUserId || "me", name: "Me" }, // Will be fixed by backend
      text: content,
      type: type as any,
      attachmentUrl,
      replyToMessage: state.replyingTo || undefined,
      timestamp: new Date().toISOString(),
      status: "sending"
    };

    // Optimistically add to UI
    set((state) => {
      const existing = state.messages[convId] || [];
      return {
        messages: { ...state.messages, [convId]: [...existing, optimisticMsg] },
        replyingTo: null // clear reply state
      };
    });

    if (state.socketConnected && socket) {
      socket.emit("send_message", { receiverId, content, attachmentUrl, replyTo: replyToId });
    } else {
      // Queue for offline
      const newQueue = [...state.offlineQueue, { receiverId, content, attachmentUrl, replyTo: replyToId, optimisticId: optimisticMsg.id }];
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

  sendMediaMessage: async (receiverId, file, type, fileName, replyToId) => {
    const socket = socketService.getSocket();
    const state = get();
    
    const conv = state.conversations.find(c => c.participants[0].id === receiverId);
    const convId = conv?.id || `temp_${Date.now()}`;
    const tempId = `opt_${Date.now()}`;
    const tempUrl = URL.createObjectURL(file as Blob);

    const optimisticMsg: Message = {
      id: tempId,
      sender: { id: useAuthStore.getState().currentUserId || "me", name: "Me" },
      text: fileName || "Attachment",
      type: type as any,
      attachmentUrl: tempUrl,
      replyToMessage: state.replyingTo || undefined,
      timestamp: new Date().toISOString(),
      status: "sending" // uploading state
    };

    set((state) => {
      const existing = state.messages[convId] || [];
      return {
        messages: { ...state.messages, [convId]: [...existing, optimisticMsg] },
        replyingTo: null
      };
    });

    try {
      const res = await uploadService.uploadFile(file as File, "messages");
      URL.revokeObjectURL(tempUrl);
      
      // Emit with real URL
      if (state.socketConnected && socket) {
        socket.emit("send_message", { receiverId, content: fileName || "Attachment", attachmentUrl: res.url, replyTo: replyToId });
      } else {
        throw new Error("Offline");
      }
    } catch (e) {
      set((state) => {
        const existing = state.messages[convId] || [];
        return {
          messages: {
            ...state.messages,
            [convId]: existing.map(m => m.id === tempId ? { ...m, status: "failed" } : m)
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
  },

  deleteMessage: (messageId: string, conversationId: string) => {
    const socket = socketService.getSocket();
    if (socket && get().socketConnected) {
      socket.emit("delete_message", { messageId, conversationId });
    }
    // Optimistically delete
    set((state) => {
      const convMessages = state.messages[conversationId] || [];
      const updatedMsgs = convMessages.map(m => 
        m.id === messageId ? { ...m, isDeleted: true, text: "This message was deleted", attachmentUrl: undefined } : m
      );
      return {
        messages: { ...state.messages, [conversationId]: updatedMsgs }
      };
    });
  },

  deleteConversation: async (receiverId: string) => {
    const state = get();
    const conv = state.conversations.find(c => c.participants[0].id === receiverId);
    if (!conv) return;
    
    // Optimistic delete
    set((state) => ({
      conversations: state.conversations.filter(c => c.id !== conv.id),
      activeConversationId: state.activeConversationId === conv.id ? null : state.activeConversationId
    }));

    try {
      await chatService.deleteConversation(conv.id); // Assuming this is added to chat.service.ts
    } catch (e) {
      console.error("Failed to delete conversation", e);
    }
  }
}));
