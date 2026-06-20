// lib/api/services/users.service.ts
import { api } from '../axios';
import { ENDPOINTS } from '../endpoints';
import { authService, type User } from './auth.service';
import { uploadService } from './upload.service';

// ============================================
// TYPES
// ============================================
export interface UpdateProfileDto {
  username?: string;
  bio?: string;
  avatarUrl?: string; // Real URL string
  coverUrl?: string; // Real cover URL string
  expertise?: { name: string; percent: number }[];
  socialLinks?: { facebook: string; instagram: string };
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================
// SERVICE
// ============================================
export const usersService = {
  /**
   * Get all users (Admin only probably)
   */
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { data } = await api.get(ENDPOINTS.USERS.GET_ALL, { params });
    const usersList = data.users || data.data || [];
    const totalCount = data.total || usersList.length;
    const pageNum = params?.page || 1;
    const limitNum = params?.limit || 10;
    return {
      users: usersList.map((u: any) => ({
        ...u,
        id: u.id || u._id,
      })),
      total: totalCount,
      page: Number(pageNum),
      totalPages: Math.ceil(totalCount / limitNum),
    };
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    try {
      const { data } = await api.get<any>(ENDPOINTS.USERS.GET_BY_ID(id));
      if (!data || (!data.id && !data._id)) {
        throw { response: { status: 404 } };
      }
      const avatarUrl = data.avatarUrl || data.avatar || data.logo || "/images/avatar.png";
      return { ...data, id: data.id || data._id, avatar: avatarUrl, avatarUrl };
    } catch (e1: any) {
      if (e1.response?.status !== 404) throw e1;
      
      try {
        const { data } = await api.get<any>(ENDPOINTS.SELLERS.GET_BY_ID(id));
        if (!data || (!data.id && !data._id)) {
          throw { response: { status: 404 } };
        }
        const avatarUrl = data.avatarUrl || data.avatar || data.logo || "/images/avatar.png";
        return { ...data, id: data.id || data._id, avatar: avatarUrl, avatarUrl };
      } catch (e2: any) {
        if (e2.response?.status !== 404) throw e2;
        
        const { data } = await api.get<any>(ENDPOINTS.ADMINS.GET_BY_ID(id));
        if (!data || (!data.id && !data._id)) {
          throw { response: { status: 404 } };
        }
        const avatarUrl = data.avatarUrl || data.avatar || data.logo || "/images/avatar.png";
        return { ...data, id: data.id || data._id, avatar: avatarUrl, avatarUrl };
      }
    }
  },

  /**
   * Update user details (JSON)
   */
  async updateUser(id: string, dto: Partial<User>): Promise<User> {
    const storedUser = authService.getStoredUser();
    const { data } = await api.patch<any>(ENDPOINTS.USERS.UPDATE(id), dto);
    
    if (storedUser && (storedUser.id === id || storedUser.id === data._id)) {
      const avatarUrl = data.avatarUrl || data.avatar || data.logo || dto.avatar || (dto as any).avatarUrl || "/images/avatar.png";
      const updatedUser = { ...storedUser, ...data, id: data._id || id, avatar: avatarUrl, avatarUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return data;
  },

  /**
   * Update user profile
   */
  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    const storedUser = authService.getStoredUser();

    // Backend expects JSON with 'name' instead of 'username', and 'bio', 'expertise', 'socialLinks'.
    const payload: any = {};
    if (dto.username) payload.name = dto.username;
    if (dto.bio !== undefined) payload.bio = dto.bio;
    if (dto.avatarUrl !== undefined) {
      payload.avatar = dto.avatarUrl;
      payload.avatarUrl = dto.avatarUrl;
      if (storedUser?.role === 'seller') {
        payload.logo = dto.avatarUrl;
      }
    }
    if (dto.coverUrl !== undefined) {
      payload.cover = dto.coverUrl;
      payload.coverUrl = dto.coverUrl;
    }
    if (dto.expertise) payload.expertise = dto.expertise;
    if (dto.socialLinks) payload.socialLinks = dto.socialLinks;

    let endpoint = ENDPOINTS.USERS.UPDATE(id);
    if (storedUser?.role === 'admin') endpoint = ENDPOINTS.ADMINS.UPDATE(id);
    else if (storedUser?.role === 'seller') endpoint = ENDPOINTS.SELLERS.UPDATE(id);

    const { data } = await api.patch<any>(endpoint, payload);
    const userObj = data.user || data.seller || data;

    if (storedUser && (storedUser.id === id || storedUser.id === (userObj as any)._id)) {
      const avatarUrl = (userObj as any).avatarUrl || userObj.avatar || (userObj as any).logo || dto.avatarUrl || "/images/avatar.png";
      const coverUrl = (userObj as any).coverUrl || userObj.cover || dto.coverUrl || "/images/profile-cover.png";
      const updatedUser = { ...storedUser, ...userObj, id: (userObj as any)._id || id, avatar: avatarUrl, avatarUrl, cover: coverUrl, coverUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return {
      ...userObj,
      id: userObj.id || userObj._id,
      avatar: userObj.avatar || userObj.avatarUrl || userObj.logo,
      cover: userObj.cover || userObj.coverUrl,
    };
  },

  /**
   * Delete user (Admin or self)
   */
  async deleteUser(id: string): Promise<void> {
    await api.delete(ENDPOINTS.USERS.DELETE(id));
  },

  /**
   * Change password
   */
  async changePassword(dto: ChangePasswordDto): Promise<void> {
    // Backend doesn't support logged-in password change yet.
    return Promise.reject(new Error("تغيير كلمة المرور غير مدعوم حالياً في الباك إند. يرجى استخدام نسيت كلمة المرور."));
  },

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const response = await uploadService.uploadFile(file, 'avatars');
    return { avatarUrl: response.url };
  },

  /**
   * Upload cover
   */
  async uploadCover(file: File): Promise<{ coverUrl: string }> {
    const response = await uploadService.uploadFile(file, 'covers');
    return { coverUrl: response.url };
  },

  /**
   * Get user credits
   */
  async getCredits(): Promise<{ credits: number }> {
    // Mocking credits since it doesn't exist on backend
    return { credits: 100 };
  },
  /**
   * Toggle follow/unfollow
   */
  async toggleFollow(userId: string): Promise<any> {
    const { data } = await api.post(ENDPOINTS.USERS.FOLLOW(userId));
    return data;
  },

  /**
   * Get Relationship Status
   */
  async getRelationship(userId: string): Promise<any> {
    const { data } = await api.get(ENDPOINTS.USERS.RELATIONSHIP(userId));
    return data;
  },

  /**
   * Send Friend Request
   */
  async sendFriendRequest(userId: string): Promise<any> {
    const { data } = await api.post(ENDPOINTS.USERS.FRIEND_REQUEST(userId));
    return data;
  },

  /**
   * Cancel Friend Request
   */
  async cancelFriendRequest(userId: string): Promise<any> {
    const { data } = await api.delete(ENDPOINTS.USERS.FRIEND_REQUEST(userId));
    return data;
  },

  /**
   * Accept Friend Request
   */
  async acceptFriendRequest(userId: string): Promise<any> {
    const { data } = await api.post(ENDPOINTS.USERS.ACCEPT_FRIEND(userId));
    return data;
  },

  /**
   * Reject Friend Request
   */
  async rejectFriendRequest(userId: string): Promise<any> {
    const { data } = await api.post(ENDPOINTS.USERS.REJECT_FRIEND(userId));
    return data;
  },

  /**
   * Block User (Admin)
   */
  async adminBlockUser(userId: string): Promise<any> {
    const { data } = await api.patch(`/users/${userId}/ban`);
    return data;
  },

  /**
   * Unblock User (Admin)
   */
  async adminUnblockUser(userId: string): Promise<any> {
    const { data } = await api.patch(`/users/${userId}/unban`);
    return data;
  },

  /**
   * Block User
   */
  async blockUser(userId: string): Promise<any> {
    const { data } = await api.post(ENDPOINTS.USERS.BLOCK(userId));
    return data;
  },

  /**
   * Unblock User
   */
  async unblockUser(userId: string): Promise<any> {
    const { data } = await api.post(ENDPOINTS.USERS.UNBLOCK(userId));
    return data;
  },

  /**
   * Get pending friend requests
   */
  async getPendingFriendRequests(): Promise<any[]> {
    const { data } = await api.get(ENDPOINTS.USERS.PENDING_FRIEND_REQUESTS);
    return data;
  },

  /**
   * Get Friends
   */
  async getFriends(userId: string, params?: any): Promise<any> {
    try {
      const { data } = await api.get(ENDPOINTS.USERS.FRIENDS(userId), { params });
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) return [];
      throw error;
    }
  },

  /**
   * Get Followers
   */
  async getFollowers(userId: string, params?: any): Promise<any> {
    try {
      const { data } = await api.get(ENDPOINTS.USERS.FOLLOWERS(userId), { params });
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) return [];
      throw error;
    }
  },

  /**
   * Get Following
   */
  async getFollowing(userId: string, params?: any): Promise<any> {
    try {
      const { data } = await api.get(ENDPOINTS.USERS.FOLLOWING(userId), { params });
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) return [];
      throw error;
    }
  },

  /**
   * Get Mutual Friends
   */
  async getMutualFriends(userId: string): Promise<any> {
    try {
      const { data } = await api.get(ENDPOINTS.USERS.MUTUAL_FRIENDS(userId));
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) return [];
      throw error;
    }
  },

  /**
   * Get Suggestions
   */
  async getSuggestions(): Promise<any> {
    const { data } = await api.get(ENDPOINTS.USERS.SUGGESTIONS);
    return data;
  },
};
// ```
// ---

// ## 📋 **ما تطلبه من الـ Backend Team**

// ### **✅ موجود حالياً:**
// ```
// ✅ POST /api/v1/auth/web/register
// ✅ POST /api/v1/auth/mob/register
// ✅ POST /api/v1/auth/web/login
// ✅ POST /api/v1/auth/mob/login
// ✅ POST /api/v1/auth/refresh
// ✅ POST /api/v1/auth/logout
// ✅ POST /api/v1/auth/forgot-password
// ✅ POST /api/v1/auth/verify-otp
// ✅ POST /api/v1/auth/reset-password
// ✅ GET  /api/v1/users
// ✅ GET  /api/v1/users/{id}
// ✅ PATCH /api/v1/users/{id}
// ✅ DELETE /api/v1/users/{id}