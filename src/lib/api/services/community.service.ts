import api from '../axios';
import { ENDPOINTS } from '../endpoints';

export const communityService = {
  getFeed: async (userId?: string) => {
    const { data } = await api.get(ENDPOINTS.COMMUNITY.FEED, { params: { userId } });
    return data;
  },

  createPost: async (content: string, image?: string) => {
    // Note: userId is usually populated from token in backend, but schema requires it.
    // If backend requires it in DTO, we need to pass it, but usually backend infers it.
    // Let's assume frontend passes user ID from its context if required.
    // Actually, looking at the backend code, `createPost` takes `dto.userId`. So we must pass it.
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { data } = await api.post(ENDPOINTS.COMMUNITY.POST, { userId: user.id || user._id, userRole: user.role, content, image });
    return data;
  },

  updatePost: async (id: string, content: string, image?: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { data } = await api.patch(ENDPOINTS.COMMUNITY.UPDATE_POST(id), { userId: user.id || user._id, content, image });
    return data;
  },

  deletePost: async (id: string) => {
    const { data } = await api.delete(ENDPOINTS.COMMUNITY.DELETE_POST(id));
    return data;
  },

  getComments: async (postId: string) => {
    const { data } = await api.get(ENDPOINTS.COMMUNITY.GET_COMMENTS(postId));
    return data;
  },

  addComment: async (postId: string, content: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { data } = await api.post(ENDPOINTS.COMMUNITY.ADD_COMMENT(postId), { userId: user.id || user._id, userRole: user.role, content });
    return data;
  },

  updateComment: async (id: string, content: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { data } = await api.patch(ENDPOINTS.COMMUNITY.UPDATE_COMMENT(id), { userId: user.id || user._id, content });
    return data;
  },

  deleteComment: async (id: string) => {
    const { data } = await api.delete(ENDPOINTS.COMMUNITY.DELETE_COMMENT(id));
    return data;
  },

  toggleLike: async (postId: string, userId: string) => {
    const { data } = await api.post(ENDPOINTS.COMMUNITY.TOGGLE_LIKE(postId), { userId });
    return data;
  }
};