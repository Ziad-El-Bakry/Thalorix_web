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
    LOGIN: '/admins/login',
    GET_BY_ID: (id: string) => `/admins/${id}`,
    UPDATE: (id: string) => `/admins/${id}`,
    GET_ALL: '/admins',
  },

  // ============================================
  // SELLERS
  // ============================================
  SELLERS: {
    LOGIN: '/seller/login',
    REGISTER: '/seller/register',
    GET_BY_ID: (id: string) => `/seller/${id}`,
    UPDATE: (id: string) => `/seller/${id}`,
  },

  // ============================================
  // OTP
  // ============================================
  OTP: {
    SEND:   '/otp/send',
    VERIFY: '/otp/verify',
    RESEND: '/otp/resend',
  },

  // ============================================
  // CLOUDINARY
  // ============================================
  CLOUDINARY: {
    UPLOAD: (slug: string) => `/cloudinary/upload/${slug}`,
    DELETE: (publicId: string) => `/cloudinary/${publicId}`,
  },

  // ============================================
  // COMMUNITY
  // ============================================
  COMMUNITY: {
    POST: '/community/post', // POST for create, GET /feed for feed
    FEED: '/community/feed',
    UPDATE_POST: (id: string) => `/community/post/${id}`,
    DELETE_POST: (id: string) => `/community/post/${id}`,
    ADD_COMMENT: (id: string) => `/community/${id}/comment`,
    GET_COMMENTS: (id: string) => `/community/${id}/comments`,
    UPDATE_COMMENT: (id: string) => `/community/comment/${id}`,
    DELETE_COMMENT: (id: string) => `/community/comment/${id}`,
    TOGGLE_LIKE: (id: string) => `/community/post/${id}/like`,
  },

  // ============================================
  // TEMPLATES
  // ============================================
  TEMPLATES: {
    CREATE: '/templates',
    GET_ALL: '/templates',
    GET_BY_ID: (id: string) => `/templates/${id}`,
    UPDATE: (id: string) => `/templates/${id}`,
    DELETE: (id: string) => `/templates/${id}`,
  },

  // ... rest of endpoints
} as const;