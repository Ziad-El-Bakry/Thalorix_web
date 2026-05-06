// lib/api/endpoints.ts

// Don't add /api/v1 here - it's already in axios baseURL
export const ENDPOINTS = {
  // ============================================
  // APP
  // ============================================
  APP: {
    INFO: '/', // Will become: /api/v1
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
    FORGOT_PASSWORD: '/auth/forgot-password',
  },

  // ============================================
  // USERS
  // ============================================
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    ME: '/users/me',
    UPDATE_PROFILE: (id: string) => `/users/${id}`,
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/upload/avatars',
    GET_CREDITS: '/users/credits',
  },

  // ============================================
  // ADMINS
  // ============================================
  ADMINS: {
    GET_BY_ID: (id: string) => `/admins/${id}`,
    UPDATE: (id: string) => `/admins/${id}`,
    GET_ALL: '/admins',
  },

  // ============================================
  // OTP
  // ============================================
  OTP: {
    SEND:   '/otp/send',
    VERIFY: '/otp/verify',
    RESEND: '/otp/resend',
  },

  // ... rest of endpoints
} as const;