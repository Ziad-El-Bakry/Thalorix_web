// lib/api/endpoints.ts

// Don't add /api/v1 here - it's already in axios baseURL
export const ENDPOINTS = {
  // ============================================
  // APP
  // ============================================
  APP: {
    INFO: '', // Will become: /api/v1
  },

  // ============================================
  // AUTH
  // ============================================
  AUTH: {
    WEB_REGISTER: '/auth/web/register',
    WEB_LOGIN: '/auth/web/login',
    MOB_REGISTER: '/auth/mob/register',
    MOB_LOGIN: '/auth/mob/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    VERIFY_EMAIL: '/auth/verify-email',
    VERIFY_OTP: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // ============================================
  // USERS
  // ============================================
  USERS: {
    FORGOT_PASSWORD: '/users/forgot-password',
    GET_ALL: '/users',
    GET_BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    ME: '/users/me',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/avatar',
    GET_CREDITS: '/users/credits',
  },

  // ... rest of endpoints
} as const;