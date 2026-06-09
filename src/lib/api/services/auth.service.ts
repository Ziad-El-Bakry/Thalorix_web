// lib/api/services/auth.service.ts
import { api } from '../axios';
import { ENDPOINTS } from '../endpoints';
import Cookies from 'js-cookie';

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
  avatarUrl?: string;
  bio?: string;
  expertise?: { name: string; percent: number }[];
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  isVerified: boolean;
  isBlocked?: boolean;
  phone?: string;
  createdAt: string;

  // Seller fields
  storeName?: string;
  storeDescription?: string;
  address?: string;
  logo?: string;
  banner?: string;
  businessCategory?: string;
  website?: string;
  businessType?: string;
  taxNumber?: string;
  verificationDocuments?: string[];
  followersCount?: number;
  followers?: string[];
  followingCount?: number;
  ratings?: number;
  reviewsCount?: number;
  salesCount?: number;
  downloadsCount?: number;
}

export interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  seller?: any;
  admin?: any;
}

// ============================================
// PLATFORM TYPE
// ============================================
type Platform = 'web' | 'mobile';

// ============================================
// HELPERS
// ============================================
const normalizeUser = (user: any): User => {
  if (!user) return user;
  const avatarUrl = user.avatarUrl || user.avatar || user.logo || "/images/avatar.png";
  return {
    ...user,
    id: user.id || user._id,
    avatar: avatarUrl,
    avatarUrl: avatarUrl,
  };
};

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
      if (token) {
        localStorage.setItem('access_token', token);
        Cookies.set('auth_token', token, { expires: 1 }); // Expires in 1 day
      }
      if (refresh) localStorage.setItem('refresh_token', refresh);

      let userObj = data.user || data.seller || data.admin;
      if (userObj) {
        if (!userObj.role) userObj.role = fallbackRole as any;
        userObj = normalizeUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
        Cookies.set('user_role', userObj.role, { expires: 1 });
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
        // 2. Try Seller
        const { data } = await api.post<AuthResponse>(ENDPOINTS.SELLERS.LOGIN, dto);

        // Process tokens first so subsequent request (GET /seller/:id) is authenticated
        processData(data, 'seller');

        // Fetch the full seller data to get the logo/avatar
        try {
          const sellerObj = data.seller || data.user;
          const sellerId = sellerObj?.id || sellerObj?._id;
          if (sellerId) {
            const response = await api.get(ENDPOINTS.SELLERS.GET_BY_ID(sellerId));
            const fullSeller = response.data?.data || response.data;
            if (fullSeller) {
              data.seller = { ...sellerObj, ...fullSeller };
              // Re-save normalized user data since it contains the full seller profile now
              processData(data, 'seller');
            }
          }
        } catch (e) {
          console.warn("Failed to fetch full seller profile on login:", e);
        }

        return data;
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
   * Login Admin directly
   */
  async adminLogin(dto: LoginDto): Promise<AuthResponse> {
    const processData = (data: any, fallbackRole: string) => {
      const token = data.access_token || data.accessToken;
      const refresh = data.refresh_token || data.refreshToken;
      if (token) {
        localStorage.setItem('access_token', token);
        Cookies.set('auth_token', token, { expires: 1 });
      }
      if (refresh) localStorage.setItem('refresh_token', refresh);

      let userObj = data.user || data.seller || data.admin;
      if (userObj) {
        if (!userObj.role) userObj.role = fallbackRole as any;
        userObj = normalizeUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
        Cookies.set('user_role', userObj.role, { expires: 1 });
        data.user = userObj;
      }

      return data;
    };

    const { data } = await api.post<AuthResponse>(ENDPOINTS.ADMINS.LOGIN, dto);
    return processData(data, 'admin');
  },

  /**
   * Register new Admin
   */
  async adminRegister(dto: RegisterDto): Promise<any> {
    const backendPayload: any = {
      name: dto.username,
      email: dto.email,
      phone: dto.phone,
      password: dto.password,
    };

    const { data } = await api.post(ENDPOINTS.ADMINS.REGISTER, backendPayload);
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
      Cookies.remove('auth_token');
      Cookies.remove('user_role');
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

    if (token) {
      localStorage.setItem('access_token', token);
      Cookies.set('auth_token', token, { expires: 1 });
    }
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
      Cookies.set('auth_token', token, { expires: 1 });
      if (refresh) localStorage.setItem('refresh_token', refresh);
      if (response.data.user) {
        const userObj = normalizeUser(response.data.user);
        response.data.user = userObj;
        localStorage.setItem('user', JSON.stringify(userObj));
        Cookies.set('user_role', userObj.role, { expires: 1 });
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
  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
      email,
      code: token,
      newPassword: newPassword,
    });
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<any>(ENDPOINTS.USERS.ME);
    return normalizeUser(data);
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
  /**
   * Change user password
   */
  async changePassword(id: string, role: string, payload: { oldPassword: string; newPassword: string; confirmPassword?: string }): Promise<void> {
    let endpoint = ENDPOINTS.USERS.CHANGE_PASSWORD(id);
    if (role === 'admin') endpoint = ENDPOINTS.ADMINS.CHANGE_PASSWORD(id);
    if (role === 'seller') endpoint = ENDPOINTS.SELLERS.CHANGE_PASSWORD(id);

    await api.patch(endpoint, payload);
  },

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? normalizeUser(JSON.parse(userStr)) : null;
  },
};