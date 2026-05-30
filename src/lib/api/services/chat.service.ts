import { api } from "../axios";
import { ENDPOINTS } from "../endpoints";

export const chatService = {
  getConversations: async () => {
    const { data } = await api.get(ENDPOINTS.CHAT.CONVERSATIONS);
    return data;
  },
  
  getMessages: async (conversationId: string, page = 1, limit = 30) => {
    const { data } = await api.get(ENDPOINTS.CHAT.MESSAGES(conversationId), {
      params: { page, limit }
    });
    return data;
  },

  startChat: async (userId: string) => {
    const { data } = await api.post(ENDPOINTS.CHAT.START, { userId });
    return data;
  }
};
