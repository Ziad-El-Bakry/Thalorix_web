# Thalorix Frontend Features & UI Documentation

This document provides a highly detailed, component-level breakdown of the user interfaces, React components, Zustand stores, state updates, API integrations, and troubleshooting techniques utilized across all frontend feature modules of the Thalorix platform.

---

## 1. Authentication & Onboarding Module

The Authentication module is designed around secure, password-strength validation, OTP email/phone authentication choices, and automated JWT token refresh cycles.

### 1.1 Pages & Mappings
*   `/login`: Standard user/seller sign-in. Renders `LoginForm`.
*   `/admin/login`: Protected login page for administrators. Renders `AdminLoginForm`.
*   `/register`: Multi-field registration form for users. Renders `RegisterForm`.
*   `/admin/register`: Multi-field registration form for admins. Renders `AdminRegisterForm`.
*   `/choose-verification`: View showing verification methods (Email/SMS). Renders `ChooseVerificationPage`.
*   `/verify-email`: Verification code entry screen. Renders `VerifyEmailForm`.
*   `/verify-otp`: Password reset OTP verification screen. Renders `VerifyOtpForm`.
*   `/forget-password`: Initial email form to trigger OTP reset. Renders `ForgetPasswordForm`.
*   `/reset-password`: Form to submit new password matching token. Renders `ResetPasswordForm`.

### 1.2 Unified Authentication Hook (`useAuth.ts`)
To isolate components from raw state and storage modifications, the custom `useAuth` hook handles calls to the API and wraps state changes in `useAuthStore`:

```typescript
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/lib/api/services/auth.service";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useAuth = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const initAuth = useAuthStore((state) => state.initAuth);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      initAuth();
      return data;
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      localStorage.clear();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return { user, currentUserId, loading, error, login, logout, initAuth };
};
```

---

## 2. Community Feed Module

The Community Feed is a collaborative interface displaying user posts, images, and links. It is designed around local like persistence, optimistic UI updates, and relevance-based client-side sorting.

### 2.1 UI Structure
The feed renders within `/dashboard/community` via `src/app/dashboard/community/page.tsx`:
*   `CreatePostBar`: Text area with media selector, link selector, and active upload progress state.
*   `PostCard`: Render card containing author profiles, images, formatted timestamps, like buttons, comments toggler, and share actions.

### 2.2 Component State & Zustand Integration (`usePostStore.ts`)
The `usePostStore` drives the feed. Likes are persistently cached in `localStorage` locally by `userId` to bypass database write round-trips for unregistered actions:

```typescript
export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  isLoading: false,
  fetchFeed: async (userId?: string) => {
    set({ isLoading: true });
    try {
      const data = await communityService.getFeed(userId);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const currentUserId = currentUser?.id || currentUser?._id || 'guest';
      const savedLikes = JSON.parse(localStorage.getItem(`liked_posts_${currentUserId}`) || '[]');
      
      const mappedPosts = data.map((backendPost: any) => {
        const post = mapBackendPost(backendPost);
        if (savedLikes.includes(post.id)) {
          post.liked = true;
          post.likes += 1;
        }
        return post;
      });
      
      const sortedPosts = sortPostsByRelevance(mappedPosts);
      set({ posts: sortedPosts, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
  toggleLike: async (postId: string, userId: string) => {
    set((state: any) => ({
      posts: state.posts.map((p: PostData) => p.id === postId ? { 
        ...p, 
        liked: !p.liked, 
        likes: p.liked ? p.likes - 1 : p.likes + 1 
      } : p)
    }));
    
    // Local storage persistence
    const likedKey = `liked_posts_${userId}`;
    const savedLikes = JSON.parse(localStorage.getItem(likedKey) || '[]');
    const currentPosts = get().posts;
    const updatedPost = currentPosts.find((p: PostData) => p.id === postId);
    
    if (updatedPost?.liked) {
      if (!savedLikes.includes(postId)) savedLikes.push(postId);
    } else {
      const idx = savedLikes.indexOf(postId);
      if (idx > -1) savedLikes.splice(idx, 1);
    }
    localStorage.setItem(likedKey, JSON.stringify(savedLikes));
  }
}));
```

---

## 3. AI Code Generator Module

The AI Code Generator `/dashboard/ai-generator` integrates a natural language prompting interface, interactive multi-file code tree navigations, live compilation status reports, and Monaco editor displays.

### 3.1 Components & State
*   `AICodeGenContainer`: Renders the main layout:
    *   Left side: Chat interface (`AIChatInterface`) to submit prompt edits or code modifications.
    *   Right side: Tabbed container holding Code workspace (rendering `Editor` from `@monaco-editor/react`) and Live Preview iframe showing remote container deployments.
*   `ChatHistorySidebar`: Loads saved user prompts, deployed project names, and session states.

### 3.2 Dynamic Monaco Code Mounting
Files generated by the AI (RunPod container compilation outputs) are loaded into the store and mapped into the editor tabs:
```jsx
import Editor from '@monaco-editor/react';

// Selected file is read from file list index
const activeFile = activeProject?.files[activeFileIndex];

return (
  <Editor
    height="100%"
    language={activeFile?.language || 'typescript'}
    value={activeFile?.content || ''}
    theme="vs-dark"
    options={{
      readOnly: false,
      minimap: { enabled: true },
      fontSize: 14,
      automaticLayout: true,
    }}
    onChange={(newVal) => handleFileEdit(activeFile.path, newVal)}
  />
);
```

### 3.3 Remote Preview and Package Downloads
*   **Preview Iframe**: Renders the server-side generated container `previewUrl` (e.g., dynamic proxy links mapped from the container port).
*   **Download Buttons**: Trigger requests to `aiService.downloadSourceZip` or `aiService.downloadDistZip` returning stream binary buffers exported into local ZIP saves.

---

## 4. Marketplace Module

The Marketplace module `/dashboard/marketplace` provides access to browse, search, purchase, and review code templates.

### 4.1 UI Layout & Mappings
*   `/dashboard/marketplace`: Grid view with categories filter, price range slider, and search bars. Renders template item list cards.
*   `/dashboard/marketplace/[id]`: Detail page showcasing description sheets, screenshots carousel, format specifications (e.g. Dimensions, File Size), reviews count, and purchase actions.
*   `/dashboard/marketplace/[id]/payment`: Handles client payment checks before routing to payment gateways.

### 4.2 Stripe Checkout Integration
Purchases connect directly to the Stripe Payment Session API:
```typescript
const handlePurchase = async (templateId: string) => {
  setPaymentLoading(true);
  try {
    const { sessionUrl } = await marketplaceService.createPurchaseSession(templateId);
    if (sessionUrl) {
      window.location.href = sessionUrl; // Redirect to secure Stripe Checkout
    }
  } catch (err) {
    console.error("Payment initiation failed:", err);
  } finally {
    setPaymentLoading(false);
  }
};
```

---

## 5. Conversations & Real-Time Chat Module

The Chat client (`/dashboard/messages`) connects users, sellers, and administrators through immediate thread syncing, typing states, and read-receipt clearing.

### 5.1 Chat Global State (`useChatStore.ts`)
```typescript
export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  
  sendMessage: async (chatId, text) => {
    // 1. Optimistic update
    const tempId = `msg_${Date.now()}`;
    const tempMsg = { id: tempId, text, senderId: get().currentUserId, createdAt: new Date() };
    set((state) => ({ messages: [...state.messages, tempMsg] }));

    // 2. Transmit via WebSockets
    socket.emit("sendMessage", { chatId, text });
  },

  onMessageReceived: (message) => {
    const active = get().activeConversation;
    if (active && active.id === message.chatId) {
      set((state) => ({ messages: [...state.messages, message] }));
      socket.emit("markRead", { messageId: message.id, chatId: message.chatId });
    } else {
      // Increment unread count in useNotificationStore
      useNotificationStore.getState().incrementUnread(message.chatId);
    }
  }
}));
```

---

## 6. Profile & Account Settings Module

The profile screen (`/dashboard/profile` or `/dashboard/settings`) manages credentials, avatar changes, notification configurations, and password updates.

### 6.1 Avatar Sync Challenge
Changing user avatars dynamically in Single-Page Applications (SPAs) without forcing page reloads requires cross-component communication.
*   **Solution**: Local storage avatar sync with global events:
```typescript
// Inside Profile component on success
localStorage.setItem("thalorix_user_avatar", uploadedAvatarUrl);
window.dispatchEvent(new CustomEvent("thalorix_avatar_sync", { detail: uploadedAvatarUrl }));
```
*   **Consumption**: Header and sidebar components subscribe to the window custom event to instantly update user header images without React context overhead.

---

## 7. Frontend Common Challenges & Workarounds

### 7.1 Emoji Picker SSR Issue
*   **Problem**: Rendering the `EmojiPicker` directly on Next.js pages throws `window is not defined` errors during server-side compilation (SSR).
*   **Solution**: Dynamic imports with SSR disabled:
```typescript
import dynamic from 'next/dynamic';

const EmojiPicker = dynamic(
  () => import('emoji-picker-react'),
  { ssr: false }
);
```

### 7.2 Safe Logouts and Axios 5xx Handling
*   **Problem**: Free-tier backend servers experience cold starts (yielding 502/503 HTTP responses). A default token-expired check could misinterpret a 503 response as an auth failure and clear the storage, logging out the user.
*   **Solution**: Safe logging checks in axios interceptors:
```typescript
const isAuthError = refreshError.response?.status >= 400 && refreshError.response?.status < 500;
if (isAuthError) {
  localStorage.clear();
  window.location.href = '/login';
}
```

---

## 8. Technical Interview Questions

### 8.1 Onboarding & Auth
1.  **Q**: Explain how you implemented the Next.js client-side JWT token refresh cycle using Axios interceptors. How do you handle concurrently queued requests when a token expires?
2.  **Q**: How does Next.js handle private routing groups like `(auth)`? What is the impact on compilation bundle splits?
3.  **Q**: How do you prevent layout shifts in the `ChooseVerificationPage` when loading state properties dynamically switch between Email and SMS layouts?
4.  **Q**: Describe how role-based routing checks are verified at the client level before matching dashboards.
5.  **Q**: Explain the mechanism used to restrict admin users from logging in on standard client portals.

### 8.2 Community Feed
1.  **Q**: Detail the client-side sorting algorithm in `usePostStore.ts`. Why did you choose to compute scores on the client side, and what are the performance impacts of doing so?
2.  **Q**: How do you implement the "Bump" feature in the feed calculation? How does `updatedAt` change the score?
3.  **Q**: Describe the implementation of optimistic UI updates when a user likes a post. How do you roll back if the server request fails?
4.  **Q**: Explain how pull-to-refresh logic is implemented on touchscreens without custom packages.
5.  **Q**: Why are liked posts cached locally in `localStorage` under `liked_posts_<userId>`? How does this cache sync with the backend?

### 8.3 AI Generator
1.  **Q**: How does the application prevent Next.js SSR build errors when importing the Monaco Editor and Emoji Picker components?
2.  **Q**: Explain the polling implementation for building AI projects. How do you clean up intervals to prevent memory leaks?
3.  **Q**: How does the frontend handle downloading zip packages from stream chunks without causing page blockages?
4.  **Q**: Explain how preview iframes render code dynamically from isolated proxy sandboxes.
5.  **Q**: What is the purpose of checking for 503 service status in `checkServiceHealth` and how does the UI handle it?

### 8.4 Marketplace
1.  **Q**: Describe the integration flow with Stripe Checkout. How does the frontend track success or cancellation responses?
2.  **Q**: How are template reviews paginated and cached in the client store?
3.  **Q**: How does the template details page dynamically format metadata fields like dimensions and file size based on the backend data?
4.  **Q**: Describe how you prevent double-submissions on the checkout button while payments are pending.
5.  **Q**: Explain how seller status approvals affect template page rendering.

### 8.5 Messages
1.  **Q**: How do you integrate Socket.IO listener events inside React hooks without creating duplicate listener bindings?
2.  **Q**: How is the unread badge calculated in the sidebar, and what event clears it when opening a chat room?
3.  **Q**: Describe the message scrolling optimization: how does the viewport automatically stick to the bottom when receiving new messages?
4.  **Q**: How do you handle sending media/attachments over websocket messages compared to REST routes?
5.  **Q**: How do you handle user status indicators (online/offline) in real-time?
