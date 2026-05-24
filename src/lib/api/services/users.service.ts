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
    return data;
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const storedUser = authService.getStoredUser();
    let endpoint = storedUser?.role === 'admin' ? ENDPOINTS.ADMINS.GET_BY_ID(id) : ENDPOINTS.USERS.GET_BY_ID(id);
    
    try {
      const { data } = await api.get<any>(endpoint);
      return {
        ...data,
        id: data.id || data._id,
        avatar: data.avatar || data.avatarUrl,
      };
    } catch (error: any) {
      if (error.response?.status === 404 && storedUser?.role === 'admin') {
        // Fallback to users collection if admin is not found in admins collection
        endpoint = ENDPOINTS.USERS.GET_BY_ID(id);
        const { data } = await api.get<any>(endpoint);
        return {
          ...data,
          id: data.id || data._id,
          avatar: data.avatar || data.avatarUrl,
        };
      }
      throw error;
    }
  },

  /**
   * Update user details (JSON)
   */
  async updateUser(id: string, dto: Partial<User>): Promise<User> {
    const { data } = await api.patch<User>(ENDPOINTS.USERS.UPDATE(id), dto);
    return data;
  },

  /**
   * Update user profile
   */
  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    // Backend expects JSON with 'name' instead of 'username', and 'bio', 'expertise', 'socialLinks'.
    const payload: any = {};
    if (dto.username) payload.name = dto.username;
    if (dto.bio !== undefined) payload.bio = dto.bio;
    if (dto.avatarUrl !== undefined) {
      payload.avatar = dto.avatarUrl;
      payload.avatarUrl = dto.avatarUrl;
    }
    if (dto.expertise) payload.expertise = dto.expertise;
    if (dto.socialLinks) payload.socialLinks = dto.socialLinks;

    const storedUser = authService.getStoredUser();
    let endpoint = storedUser?.role === 'admin' ? ENDPOINTS.ADMINS.UPDATE(id) : ENDPOINTS.USERS.UPDATE(id);

    try {
      const { data } = await api.patch<any>(endpoint, payload);
      return {
        ...data,
        id: data.id || data._id,
        avatar: data.avatar || data.avatarUrl,
      };
    } catch (error: any) {
      if (error.response?.status === 404 && storedUser?.role === 'admin') {
        // Fallback to users collection if admin is not found in admins collection
        endpoint = ENDPOINTS.USERS.UPDATE(id);
        const { data } = await api.patch<any>(endpoint, payload);
        return {
          ...data,
          id: data.id || data._id,
          avatar: data.avatar || data.avatarUrl,
        };
      }
      throw error;
    }
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
   * Get user credits
   */
  async getCredits(): Promise<{ credits: number }> {
    // Mocking credits since it doesn't exist on backend
    return { credits: 100 };
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