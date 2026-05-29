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

export interface RegisterSellerDto extends RegisterDto {
  storeName?: string;
  storeDescription?: string;
  address?: string;
}

export interface User {
  id: string;
  name?: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'seller';
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
   * Universal Login (Web)
   * Tries User, then Seller, then Admin automatically.
   */
  async login(dto: LoginDto, platform: Platform = 'web'): Promise<AuthResponse> {
    const processData = (data: any, fallbackRole: string) => {
      const token = data.access_token || data.accessToken;
      const refresh = data.refresh_token || data.refreshToken;
      if (token) localStorage.setItem('access_token', token);
      if (refresh) localStorage.setItem('refresh_token', refresh);
      
      const userObj = data.user || data.seller || data.admin;
      if (userObj) {
        if (!userObj.role) userObj.role = fallbackRole as any;
        localStorage.setItem('user', JSON.stringify(userObj));
        data.user = userObj; // Ensure .user is always available
      }
      
      return data;
    };

    try {
      // 1. Try User
      const endpoint = platform === 'web' ? ENDPOINTS.AUTH.WEB_LOGIN : ENDPOINTS.AUTH.MOB_LOGIN;
      const { data } = await api.post<AuthResponse>(endpoint, dto);
      return processData(data, 'user');
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        try {
          // 2. Try Seller
          const { data } = await api.post<AuthResponse>(ENDPOINTS.SELLERS.LOGIN, dto);
          return processData(data, 'seller');
        } catch (err2: any) {
          if (err2.response?.status === 401 || err2.response?.status === 404) {
            // 3. Try Admin
            const { data } = await api.post<AuthResponse>(ENDPOINTS.ADMINS.LOGIN, dto);
            return processData(data, 'admin');
          }
          throw err2;
        }
      }
      throw err;
    }
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
   * Register new seller
   */
  async registerSeller(dto: RegisterSellerDto): Promise<any> {
    const backendPayload: any = {
      name: dto.username,
      email: dto.email,
      phone: dto.phone,
      password: dto.password,
      storeName: dto.storeName || undefined,
      storeDescription: dto.storeDescription || undefined,
      address: dto.address || undefined,
    };

    const { data } = await api.post(ENDPOINTS.SELLERS.REGISTER, backendPayload);
    return data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error: any) {
      // It's normal to get a 401 here if the session is already expired
      if (error?.response?.status !== 401) {
        console.warn('Logout warning:', error?.message || 'Failed to logout from server');
      }
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
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  },

  /**
   * Get stored user
   */
  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};