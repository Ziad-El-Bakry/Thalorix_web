import { create } from 'zustand';
import { authService, User } from '@/lib/api/services/auth.service';

interface AuthState {
  user: User | null;
  currentUserId: string | null;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  currentUserId: null,
  initAuth: async () => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      set({ user: storedUser, currentUserId: storedUser.id });

      // Dynamically fetch and sync full profile on mount to get store logo/avatar if not present or changed
      try {
        const { usersService } = await import('@/lib/api/services/users.service');
        const fullUser = await usersService.getUserById(storedUser.id);
        if (fullUser) {
          localStorage.setItem('user', JSON.stringify(fullUser));
          set({ user: fullUser });

          // Sync global avatar store
          const avatarUrl = fullUser.avatar || fullUser.avatarUrl || "/images/avatar.png";
          localStorage.setItem("thalorix_user_avatar", avatarUrl);
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("thalorix_avatar_sync", { detail: avatarUrl }));
          }
        }
      } catch (err) {
        console.warn("Failed to fetch/sync full user profile on initAuth:", err);
      }
    }
  }
}));
