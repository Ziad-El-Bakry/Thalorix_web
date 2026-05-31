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
  initAuth: () => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      set({ user: storedUser, currentUserId: storedUser.id });
    }
  }
}));
