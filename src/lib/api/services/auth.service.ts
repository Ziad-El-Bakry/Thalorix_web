// lib/api/services/auth.service.ts
import { api } from '../axios';
import { ENDPOINTS } from '../endpoints';

// ============================================
// TYPES
// ============================================
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword?: string;
}

export interface User {
  id: string;
  name?: string;
  username: string;
  email: string;
  role: 'user' | 'developer' | 'admin';
  credits: number;
  avatar?: string;
  bio?: string;
  expertise?: { name: string; percent: number }[];
  socialLinks?: { facebook: string; instagram: string };
  isVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  accessToken?: string;
  refreshToken?: string;
  user: User;
}

// ============================================
// PLATFORM TYPE
// ============================================
type Platform = 'web' | 'mobile';

// ============================================
// SERVICE
// ============================================
export const authService = {
  /**
   * Login user (Web or Mobile)
   */
  async login(dto: LoginDto, platform: Platform = 'web'): Promise<AuthResponse> {
    const endpoint = platform === 'web' 
      ? ENDPOINTS.AUTH.WEB_LOGIN 
      : ENDPOINTS.AUTH.MOB_LOGIN;

    const { data } = await api.post<AuthResponse>(endpoint, dto);

    // Save tokens
    const token = data.access_token || data.accessToken;
    const refresh = data.refresh_token || data.refreshToken;
    
    if (token) localStorage.setItem('access_token', token);
    if (refresh) localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  },

  /**
   * Register new user (Web or Mobile)
   */
  async register(dto: RegisterDto, platform: Platform = 'web'): Promise<AuthResponse> {
    const endpoint = platform === 'web' 
      ? ENDPOINTS.AUTH.WEB_REGISTER 
      : ENDPOINTS.AUTH.MOB_REGISTER;

    // Map frontend DTO to backend DTO expected fields
    const backendPayload: any = {
      name: dto.username,
      email: dto.email,
      password: dto.password,
      cPassword: dto.confirmPassword,
    };
    
    // Send phone as it is required by the backend
    backendPayload.phone = dto.phone;

    const { data } = await api.post<AuthResponse>(endpoint, backendPayload);

    return data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
    }
  },

  /**
   * Refresh access token
   */
  async refresh(refreshToken: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(ENDPOINTS.AUTH.REFRESH, {
      refreshToken: refreshToken,
    });

    // Update tokens
    const token = data.access_token || data.accessToken;
    const refresh = data.refresh_token || data.refreshToken;
    
    if (token) localStorage.setItem('access_token', token);
    if (refresh) localStorage.setItem('refresh_token', refresh);

    return data;
  },

  /**
   * Verify email with token (if backend implements)
   */
  async verifyEmail(token: string): Promise<void> {
    await api.post(ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  },

  /**
   * Verify OTP code
   */
  async verifyOtp(data: { email: string; otp: string }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.VERIFY_OTP, {
      email: data.email,
      code: data.otp,
    });
    
    // If verification returns tokens, save them
    const token = response.data?.access_token || response.data?.accessToken;
    const refresh = response.data?.refresh_token || response.data?.refreshToken;
    
    if (token) {
      localStorage.setItem('access_token', token);
      if (refresh) localStorage.setItem('refresh_token', refresh);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response.data;
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  /**
   * Reset password with token (if backend implements)
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      new_password: newPassword,
    });
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<User>(ENDPOINTS.USERS.ME);
    return data;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  /**
   * Get stored user
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};