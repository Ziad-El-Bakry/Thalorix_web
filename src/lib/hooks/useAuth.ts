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

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(userData);
      return data;
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Registration failed");
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

  return {
    user,
    currentUserId,
    loading,
    error,
    login,
    register,
    logout,
    initAuth,
  };
};