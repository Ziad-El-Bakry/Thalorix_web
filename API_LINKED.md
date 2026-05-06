# ✅ API Integration Guide - All Endpoints Linked

## Configuration Overview

Your frontend is now configured to use a **Next.js proxy** that forwards all API requests to your Replit backend, bypassing CORS issues.

### How It Works:

```
Frontend Request
    ↓
http://localhost:3000/api/v1/...  (Your Next.js app on localhost:3000)
    ↓
next.config.mjs proxy rewrites the request
    ↓
https://thalorix-back-end--omarshabour1.replit.app/api/v1/...  (Replit backend)
    ↓
Response sent back to frontend
```

## Environment Configuration

**File:** `.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_API_VERSION=v1
```

**Result URL:** `http://localhost:3000/api/v1`

**File:** `next.config.mjs`

```javascript
rewrites: {
  beforeFiles: [
    {
      source: "/api/:path*",
      destination: "https://thalorix-back-end--omarshabour1.replit.app/api/:path*",
    },
  ];
}
```

---

## All Linked Endpoints

### 📱 App

| Method | Endpoint | Full URL      |
| ------ | -------- | ------------- |
| GET    | `/app`   | `/api/v1/app` |

**Service:** `src/lib/api/services/index.ts`

---

### 👥 Users

| Method | Endpoint                 | Configuration           | Service            |
| ------ | ------------------------ | ----------------------- | ------------------ |
| GET    | `/users`                 | `USERS.GET_ALL`         | `users.service.ts` |
| GET    | `/users/{id}`            | `USERS.GET_BY_ID(id)`   | `users.service.ts` |
| PATCH  | `/users/{id}`            | `USERS.UPDATE(id)`      | `users.service.ts` |
| DELETE | `/users/{id}`            S.DELETE(id)`      | `users.service.ts` |
| GET    | `/users/me`              | `USERS.ME`              | `users.service.ts` |
| PATCH  | `/users/profile`         | `USERS.UPDATE_PROFILE`  | `users.service.ts` |
| PATCH  | `/users/change-password` | `USERS.CHANGE_PASSWORD` | `users.service.ts` |
| POST   | `/users/avatar`          | `USERS.UPLOAD_AVATAR`   | `users.service.ts` |
| GET    | `/users/credits`         | `USERS.GET_CREDITS`     | `users.service.ts` |

**Service File:** `src/lib/api/services/users.service.ts`

---

### 🔐 Auth

| Method | Endpoint               | Configuration         | Service           |
| ------ | ---------------------- | --------------------- | ----------------- |
| POST   | `/auth/web/register`   | `AUTH.WEB_REGISTER`   | `auth.service.ts` |
| POST   | `/auth/mob/register`   | `AUTH.MOB_REGISTER`   | `auth.service.ts` |
| POST   | `/auth/web/login`      | `AUTH.WEB_LOGIN`      | `auth.service.ts` |
| POST   | `/auth/mob/login`      | `AUTH.MOB_LOGIN`      | `auth.service.ts` |
| POST   | `/auth/refresh`        | `AUTH.REFRESH`        | `auth.service.ts` |
| POST   | `/auth/logout`         | `AUTH.LOGOUT`         | `auth.service.ts` |
| POST   | `/auth/forgot-password`| `AUTH.FORGOT_PASSWORD`| `auth.service.ts` |
| POST   | `/auth/verify-email`   | `AUTH.VERIFY_EMAIL`   | `auth.service.ts` |
| POST   | `/auth/verify-otp`     | `AUTH.VERIFY_OTP`     | `auth.service.ts` |
| POST   | `/auth/reset-password` | `AUTH.RESET_PASSWORD` | `auth.service.ts` |

**Service File:** `src/lib/api/services/auth.service.ts`

---

## Code Structure

### Endpoint Definition

**File:** `src/lib/api/endpoints.ts`

```typescript
export const ENDPOINTS = {
  AUTH: {
    WEB_LOGIN: "/auth/web/login",
    WEB_REGISTER: "/auth/web/register",
    // ... all endpoints
  },
  USERS: {
    GET_ALL: "/users",
    GET_BY_ID: (id: string) => `/users/${id}`,
    // ... all endpoints
  },
};
```

### API Client Setup

**File:** `src/lib/api/axios.ts`

```typescript
const API_URL = "http://localhost:3000/api/v1"; // From .env.local

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
  withCredentials: true,
});

// Interceptors for auth token & error handling
```

### Service Usage

**File:** `src/lib/api/services/auth.service.ts`

```typescript
import { api } from "../axios";
import { ENDPOINTS } from "../endpoints";

export const authService = {
  async login(dto: LoginDto, platform = "web") {
    const endpoint =
      platform === "web" ? ENDPOINTS.AUTH.WEB_LOGIN : ENDPOINTS.AUTH.MOB_LOGIN;

    return api.post(endpoint, dto);
  },
};
```

### Component Usage

**Example:** `src/components/features/auth/LoginForm.tsx`

```typescript
import { authService } from "@/lib/api/services/auth.service";

export function LoginForm() {
  const handleSubmit = async (data) => {
    try {
      const response = await authService.login(data);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
}
```

---

## Testing the Connection

### 1. Start Dev Server

```bash
npm run dev
```

### 2. Visit Test Page

```
http://localhost:3000/test-connection
```

### 3. Check Console

The browser console will show:

```
🌐 Environment:
  - API_BASE_URL: http://localhost:3000/api
  - API_VERSION: v1
  - Final API_URL: http://localhost:3000/api/v1
```

### 4. Test Specific Endpoint

```bash
# In browser console
import { authService } from '@/lib/api/services/auth.service';
authService.login({ email: 'test@test.com', password: 'test' });
```

---

## Request Flow Example

### Login Request:

```
1. Component calls: authService.login({ email, password })
                ↓
2. Service constructs URL: /auth/web/login
                ↓
3. Axios creates full URL: http://localhost:3000/api/v1/auth/web/login
                ↓
4. Request interceptor adds auth token + metadata
                ↓
5. next.config.mjs proxy rewrites:
   FROM: http://localhost:3000/api/v1/auth/web/login
   TO:   https://thalorix-back-end--omarshabour1.replit.app/api/v1/auth/web/login
                ↓
6. Backend processes request
                ↓
7. Response interceptor handles errors & token refresh
                ↓
8. Component receives response
```

---

## File Structure

```
src/lib/api/
├── axios.ts                 # Axios instance with interceptors
├── endpoints.ts             # All API endpoint definitions
├── validateConfig.ts        # Configuration validator
└── services/
    ├── index.ts             # Export all services
    ├── auth.service.ts      # Authentication endpoints
    ├── users.service.ts     # User management endpoints
    ├── ai.service.ts        # AI Generator endpoints
    ├── community.service.ts # Community endpoints
    ├── marketplace.service.ts # Marketplace endpoints
    └── message.service.ts   # Messaging endpoints
```

---

## Debugging

### Enable Debug Logs

In `.env.local`:

```env
NEXT_PUBLIC_DEBUG_MODE=true
```

### View Request Details

Browser DevTools → Network Tab → Click API request

### Check Proxy

```bash
# In browser console
fetch('/api/v1/app').then(r => r.json()).then(console.log)
```

---

## Common Issues & Solutions

| Issue            | Solution                                |
| ---------------- | --------------------------------------- |
| CORS Error       | Proxy is enabled, no action needed      |
| 404 Not Found    | Check endpoint path in `endpoints.ts`   |
| 401 Unauthorized | Token expired, auto-refresh will handle |
| Timeout          | Check backend is running                |
| Blank Response   | Check request body format               |

---

## Status: ✅ All APIs Linked and Ready!

All endpoints are properly configured and linked to your Replit backend through the Next.js proxy. You can now make API calls from your components without CORS issues.
