// lib/api/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { validateApiConfig } from './validateConfig';

// Extend Axios config to include custom metadata property
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

// ============================================
// Configuration
// ============================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
                     process.env.NEXT_PUBLIC_API_URL || 
                     'http://localhost:3001';

const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

// Construct full API URL
// If API_BASE_URL already contains /api, don't add it again
let API_URL: string;

if (API_BASE_URL.includes('/api')) {
  // Already has /api in the URL
  API_URL = `${API_BASE_URL}/${API_VERSION}`;
} else {
  // Add /api to the URL
  API_URL = `${API_BASE_URL}/api/${API_VERSION}`;
}

// Log for debugging
console.log('🌐 Environment:');
console.log('  - API_BASE_URL:', API_BASE_URL);
console.log('  - API_VERSION:', API_VERSION);
console.log('  - Final API_URL:', API_URL);

// Validate configuration
if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
  validateApiConfig();
}

// ============================================
// Create Axios Instance
// ============================================
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

// ============================================
// Request Interceptor
// ============================================
api.interceptors.request.use(
  (config) => {
    // Add timestamp for debugging
    if (config.metadata === undefined) {
      config.metadata = { startTime: new Date().getTime() };
    }

    // Add auth token
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug logging
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
      console.log('📤 Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        fullUrl: `${config.baseURL}${config.url}`,
        headers: config.headers,
      });
    }

    return config;
  },
  (error) => {
    console.error('🔴 Request Error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// Response Interceptor
// ============================================
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    if (response.config.metadata?.startTime) {
      const duration = new Date().getTime() - response.config.metadata.startTime;
      
      if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
        console.log(`📥 Response (${duration}ms):`, {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
      }
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Enhanced error logging with network diagnostics
    const isNetworkError = error.message === 'Network Error' || !error.response;
    const errorDetails = {
      status: error.response?.status,
      url: error.config?.url,
      fullUrl: error.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown',
      message: error.message,
      code: error.code,
      response: error.response?.data,
      isNetworkError,
      hint: isNetworkError ? '🔧 Backend might be down or unreachable. Check API_BASE_URL and ensure backend is running.' : undefined,
    };

    console.error('🔴 API Error:', errorDetails);

    // Token refresh logic (only for 401 errors)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          console.log('❌ No refresh token found');
          throw new Error('No refresh token');
        }

        console.log('🔄 Attempting to refresh token...');

        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        console.log('✅ Token refreshed successfully');

        // Save new token
        localStorage.setItem('access_token', data.access_token);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        
        // Clear storage and redirect
        localStorage.clear();
        
        // Only redirect if we're in browser
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// Export API instance
// ============================================
export default api;