// lib/api/services/users.service.ts
import { api } from '../axios';
import { ENDPOINTS } from '../endpoints';
import type { User } from './auth.service';

// ============================================
// TYPES
// ============================================
export interface UpdateProfileDto {
  username?: string;
  bio?: string;
  avatar?: File;
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
    return data;
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const { data } = await api.get<User>(ENDPOINTS.USERS.GET_BY_ID(id));
    return data;
  },

  /**
   * Update user profile
   */
  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    const formData = new FormData();

    if (dto.username) formData.append('username', dto.username);
    if (dto.bio) formData.append('bio', dto.bio);
    if (dto.avatar) formData.append('avatar', dto.avatar);

    const { data } = await api.patch<User>(
      ENDPOINTS.USERS.UPDATE_PROFILE(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
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
    await api.post(ENDPOINTS.USERS.CHANGE_PASSWORD, dto);
  },

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post(
      ENDPOINTS.USERS.UPLOAD_AVATAR,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data.avatarUrl ? data : { avatarUrl: data.secure_url || data.url || data };
  },

  /**
   * Get user credits
   */
  async getCredits(): Promise<{ credits: number }> {
    const { data } = await api.get(ENDPOINTS.USERS.GET_CREDITS);
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
// ✅ POST /api/v1/users/forgot-password
// ✅ GET  /api/v1/users
// ✅ GET  /api/v1/users/{id}
// ✅ PATCH /api/v1/users/{id}
// ✅ DELETE /api/v1/users/{id}