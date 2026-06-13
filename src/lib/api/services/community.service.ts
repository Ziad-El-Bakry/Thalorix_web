import api from '../axios';
import { ENDPOINTS } from '../endpoints';

const userFetchPromises = new Map<string, Promise<any>>();

async function fetchUserSafe(uid: string) {
  if (typeof window !== "undefined") {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const currentUserId = storedUser.id || storedUser._id;
      if (uid === currentUserId) {
        const reactiveAvatar = localStorage.getItem('thalorix_user_avatar');
        return {
          _id: currentUserId,
          id: currentUserId,
          name: storedUser.name || storedUser.username || "User",
          avatar: reactiveAvatar || storedUser.avatar || storedUser.avatarUrl || storedUser.logo || "/images/avatar.png",
          avatarUrl: reactiveAvatar || storedUser.avatarUrl || storedUser.avatar || storedUser.logo || "/images/avatar.png",
          role: storedUser.role || "user",
        };
      }
    } catch {}
  }

  if (userFetchPromises.has(uid)) {
    return userFetchPromises.get(uid);
  }
  
  const promise = (async () => {
    try {
      const { data } = await api.get(ENDPOINTS.USERS.GET_BY_ID(uid), { skipWarning: true });
      return data.data || data;
    } catch {
      try {
        const { data } = await api.get(ENDPOINTS.SELLERS.GET_BY_ID(uid), { skipWarning: true });
        return data.data || data;
      } catch {
        try {
           const { data } = await api.get(ENDPOINTS.ADMINS.GET_BY_ID(uid), { skipWarning: true });
           return data.data || data;
        } catch {
           return { _id: uid, name: 'Unknown User', username: 'Unknown User' };
        }
      }
    }
  })();
  
  userFetchPromises.set(uid, promise);
  return promise;
}

async function populateUser(item: any) {
  if (!item.userId || typeof item.userId !== 'string') return item;
  const user = await fetchUserSafe(item.userId);
  return { ...item, userId: user };
}

export const communityService = {
  getFeed: async (userId?: string) => {
    const { data } = await api.get(ENDPOINTS.COMMUNITY.FEED, { params: { userId } });
    const populated = await Promise.all((data || []).map(populateUser));
    return populated;
  },

  createPost: async (content: string, image?: string, link?: string) => {
    // Note: userId is usually populated from token in backend, but schema requires it.
    // If backend requires it in DTO, we need to pass it, but usually backend infers it.
    // Let's assume frontend passes user ID from its context if required.
    // Actually, looking at the backend code, `createPost` takes `dto.userId`. So we must pass it.
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { data } = await api.post(ENDPOINTS.COMMUNITY.POST, { userId: user.id || user._id, userRole: user.role, content, image, link });
    return data;
  },

  updatePost: async (id: string, content: string, image?: string, link?: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { data } = await api.patch(ENDPOINTS.COMMUNITY.UPDATE_POST(id), { userId: user.id || user._id, content, image, link });
    return data;
  },

  deletePost: async (id: string) => {
    const { data } = await api.delete(ENDPOINTS.COMMUNITY.DELETE_POST(id));
    return data;
  },

  getComments: async (postId: string) => {
    const { data } = await api.get(ENDPOINTS.COMMUNITY.GET_COMMENTS(postId));
    const populated = await Promise.all((data || []).map(populateUser));
    return populated;
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