# API Configuration Guide

## Overview

This guide helps you configure the Thalorix API connection for local development and production.

## 1. Environment Configuration

### .env.local

In your `thalorix-web` project, create or update `.env.local`:

```env
# Backend API URLs
NEXT_PUBLIC_API_URL=https://thalorix-back-end--omarshabour1.replit.app
NEXT_PUBLIC_API_BASE_URL=https://thalorix-back-end--omarshabour1.replit.app/api
NEXT_PUBLIC_API_VERSION=v1

# Real-time connection
NEXT_PUBLIC_SOCKET_URL=https://thalorix-back-end--omarshabour1.replit.app
```

**Result:** `https://thalorix-back-end--omarshabour1.replit.app/api/v1`

#### Option 2: Backend without /api path (For custom servers)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_VERSION=v1
```

**Result:** `http://localhost:3001/api/v1`

#### Option 3: Local Development

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_API_VERSION=v1
```

**Result:** `http://localhost:3001/v1`

## Setup Steps

### 1. Choose Your Backend

Decide whether you're using:

- ✅ **Local Backend** (Development): `http://localhost:3001`
- ✅ **Replit Backend** (Production): `https://thalorix-back-end--omarshabour1.replit.app`

### 2. Update `.env.local`

Edit the `.env.local` file in your project root:

```env
# For local development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_API_VERSION=v1

# Debug settings
NEXT_PUBLIC_DEBUG_MODE=true
```

### 3. Restart Dev Server

After updating `.env.local`, restart your Next.js dev server:

```bash
npm run dev
```

### 4. Test the Connection

Visit: `http://localhost:3000/test-connection`

This page will:

- Display your configured API URL
- Attempt to connect to the API
- Show detailed error information if connection fails
- Provide troubleshooting steps

## Troubleshooting

### Network Error: Backend Unreachable

**Issue:** `Network Error` when trying to connect

**Solutions:**

1. **Verify backend is running:**

   ```bash
   # Terminal 1: Backend
   cd ../thalorix-backend
   npm run dev

   # Terminal 2: Frontend
   npm run dev
   ```

2. **Check API URL:** Verify `NEXT_PUBLIC_API_BASE_URL` is correct
   - Local: `http://localhost:3001`
   - Replit: `https://thalorix-back-end--omarshabour1.replit.app/api`

3. **Enable CORS** on your backend
   - Backend must allow requests from `http://localhost:3000`

4. **Check Firewall:** Ensure port 3001 is not blocked

### Network Request Failing

**Check the browser DevTools:**

- Open DevTools (F12)
- Go to **Network** tab
- Refresh the page
- Look for failed API requests
- Click on the request to see:
  - Status code
  - Response headers
  - Response body (error message)

### CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution - update backend `server.ts`:**

```typescript
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

## API Endpoints

All endpoints are automatically prefixed with the configured base URL:

| Endpoint          | Full URL                   |
| ----------------- | -------------------------- |
| `/auth/web/login` | `{API_URL}/auth/web/login` |
| `/users/me`       | `{API_URL}/users/me`       |
| `/users/profile`  | `{API_URL}/users/profile`  |

See `src/lib/api/endpoints.ts` for all available endpoints.

## Debug Mode

Enable detailed logging by setting:

```env
NEXT_PUBLIC_DEBUG_MODE=true
```

This will log:

- ✅ All API requests
- 📊 Request/response timing
- ⚠️ Error details with CORS hints
- 🔍 Configuration validation results

## File References

- **Axios Config:** `src/lib/api/axios.ts`
- **Endpoints:** `src/lib/api/endpoints.ts`
- **API Services:** `src/lib/api/services/`
- **Environment vars:** `.env.local`
- **Config Validation:** `src/lib/api/validateConfig.ts`
- **Connection Test:** `/test-connection` page

## Common Issues

| Issue               | Solution                                             |
| ------------------- | ---------------------------------------------------- |
| Backend not found   | Check `NEXT_PUBLIC_API_BASE_URL` is correct          |
| CORS blocked        | Enable CORS on backend for `http://localhost:3000`   |
| 401 Unauthorized    | Check token is valid, token refresh might be needed  |
| Timeout             | Increase backend response time or check backend logs |
| Port already in use | Change port in .env.local or kill existing process   |
