"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/lib/api/services/auth.service";

export function useNotifications() {
  const store = useNotificationStore();
  const storeUserId = useAuthStore((state) => state.currentUserId);
  const user = authService.getStoredUser();
  const currentUserId = storeUserId || user?.id || null;

  useEffect(() => {
    if (currentUserId) {
      store.initNotifications(currentUserId);
    }
  }, [currentUserId, store]);

  return {
    hasUnread: store.hasUnreadNotifications,
    hasUnreadMessages: store.hasUnreadMessages,
    markNotificationsRead: store.markNotificationsRead,
    markMessagesRead: store.markMessagesRead,
  };
}

