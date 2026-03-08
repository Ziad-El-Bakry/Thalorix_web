# 🚀 Quick API Reference

## ⚙️ Configuration

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api  # Proxies to Replit backend
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_DEBUG_MODE=true
```

---

## 📡 API Base URL

```
http://localhost:3000/api/v1
↓ (via proxy)
https://thalorix-back-end--om8523302.replit.app/api/v1
```

---

## 🔑 Authentication Examples

### Register

```typescript
import { authService } from "@/lib/api/services/auth.service";

const response = await authService.register({
  username: "john",
  email: "john@example.com",
  password: "password123",
});
// POST /api/v1/auth/web/register
```

### Login

```typescript
const response = await authService.login({
  email: "john@example.com",
  password: "password123",
});
// POST /api/v1/auth/web/login
```

### Logout

```typescript
await authService.logout();
// POST /api/v1/auth/logout
```

---

## 👤 User Management Examples

### Get Current User

```typescript
import { usersService } from "@/lib/api/services/users.service";

const user = await usersService.getCurrentUser();
// GET /api/v1/users/me
```

### Get All Users

```typescript
const users = await usersService.getAll();
// GET /api/v1/users
```

### Get User by ID

```typescript
const user = await usersService.getById("user-id-123");
// GET /api/v1/users/user-id-123
```

### Update User Profile

```typescript
const updated = await usersService.updateProfile({
  username: "newid",
  email: "new@example.com",
});
// PATCH /api/v1/users/profile
```

### Upload Avatar

```typescript
const formData = new FormData();
formData.append("avatar", file);
const response = await usersService.uploadAvatar(formData);
// POST /api/v1/users/avatar
```

### Get User Credits

```typescript
const credits = await usersService.getCredits();
// GET /api/v1/users/credits
```

---

## 🔄 Error Handling

```typescript
try {
  const response = await authService.login(credentials);
} catch (error) {
  // Error details logged automatically
  console.error(error.response?.status); // HTTP status
  console.error(error.response?.data); // Error message
  console.error(error.message); // Network error?
}
```

---

## 🔐 Token Management

Tokens are automatically:

- ✅ Stored in localStorage
- ✅ Added to request headers
- ✅ Refreshed on 401 response
- ✅ Cleared on logout

---

## 📂 Service Files

| Service     | File                                          |
| ----------- | --------------------------------------------- |
| Auth        | `src/lib/api/services/auth.service.ts`        |
| Users       | `src/lib/api/services/users.service.ts`       |
| AI          | `src/lib/api/services/ai.service.ts`          |
| Community   | `src/lib/api/services/community.service.ts`   |
| Marketplace | `src/lib/api/services/marketplace.service.ts` |
| Messages    | `src/lib/api/services/message.service.ts`     |

---

## 🧪 Test Connection

Visit: `http://localhost:3000/test-connection`

---

## ✅ Status: All APIs Linked!

All endpoints from your Postman collection are now integrated and ready to use.
