import { create } from "zustand";
import { usersService } from "@/lib/api/services/users.service";

export interface NotificationItem {
  id: string;
  type: "info" | "success" | "error" | "friend_request" | "message";
  title: string;
  desc: string;
  time: string; // ISO String
  isRead: boolean;
  senderId?: string;
  actionTaken?: "accepted" | "rejected" | null;
}

interface NotificationStore {
  notifications: NotificationItem[];
  hasUnreadNotifications: boolean;
  hasUnreadMessages: boolean;
  currentUserId: string | null;

  // Actions
  initNotifications: (userId: string) => void;
  addNotification: (notif: Omit<NotificationItem, "id" | "time" | "isRead">) => void;
  markNotificationsRead: () => void;
  markMessagesRead: () => void;
  setHasUnreadMessages: (val: boolean) => void;
  clearAll: () => void;
  deleteNotification: (id: string) => void;
  updateNotificationAction: (id: string, action: "accepted" | "rejected") => void;
  fetchFriendRequests: () => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => {
  // Helper to persist state to localStorage
  const persist = (userId: string, notifications: NotificationItem[], hasUnreadMessages: boolean) => {
    try {
      localStorage.setItem(`thalorix_notifications_${userId}`, JSON.stringify(notifications));
      localStorage.setItem(`thalorix_unread_messages_${userId}`, JSON.stringify(hasUnreadMessages));
    } catch (e) {
      console.error("Failed to persist notification state", e);
    }
  };

  return {
    notifications: [],
    hasUnreadNotifications: false,
    hasUnreadMessages: false,
    currentUserId: null,

    initNotifications: (userId: string) => {
      if (!userId) return;
      if (get().currentUserId === userId) return; // Already initialized for this user

      let storedNotifs: NotificationItem[] = [];
      let storedUnreadMsgs = false;

      try {
        const notifData = localStorage.getItem(`thalorix_notifications_${userId}`);
        const unreadMsgsData = localStorage.getItem(`thalorix_unread_messages_${userId}`);

        if (notifData) {
          storedNotifs = JSON.parse(notifData);
        } else {
          // Pre-populate with default onboarding notifications if empty
          storedNotifs = [
            {
              id: "welcome_init",
              type: "info",
              title: "Welcome to Thalorix",
              desc: "We're glad to have you here! Explore the dashboard.",
              time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
              isRead: false,
            },
            {
              id: "profile_update_init",
              type: "success",
              title: "Profile updated",
              desc: "Your personal details were saved successfully.",
              time: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago
              isRead: false,
            },
            {
              id: "profile_delete_init",
              type: "error",
              title: "Profile Deleted",
              desc: "Your personal details were deleted successfully.",
              time: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
              isRead: true,
            }
          ];
          localStorage.setItem(`thalorix_notifications_${userId}`, JSON.stringify(storedNotifs));
        }

        if (unreadMsgsData) {
          storedUnreadMsgs = JSON.parse(unreadMsgsData);
        }
      } catch (e) {
        console.error("Failed to parse stored notification data", e);
      }

      const hasUnreadNotifs = storedNotifs.some((n) => !n.isRead);

      set({
        currentUserId: userId,
        notifications: storedNotifs,
        hasUnreadNotifications: hasUnreadNotifs,
        hasUnreadMessages: storedUnreadMsgs,
      });
    },

    addNotification: (notif) => {
      const userId = get().currentUserId;
      if (!userId) return;

      const newNotif: NotificationItem = {
        ...notif,
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        time: new Date().toISOString(),
        isRead: false,
      };

      set((state) => {
        // Prevent duplicate friend requests or message notifications if they already exist as unread
        if (
          (newNotif.type === "friend_request" || newNotif.type === "message") &&
          state.notifications.some(
            (n) => n.type === newNotif.type && n.senderId === newNotif.senderId && !n.isRead
          )
        ) {
          return state;
        }

        const updated = [newNotif, ...state.notifications];
        persist(userId, updated, state.hasUnreadMessages);
        return {
          notifications: updated,
          hasUnreadNotifications: true,
        };
      });
    },

    markNotificationsRead: () => {
      const userId = get().currentUserId;
      if (!userId) return;

      set((state) => {
        const updated = state.notifications.map((n) => ({ ...n, isRead: true }));
        persist(userId, updated, state.hasUnreadMessages);
        return {
          notifications: updated,
          hasUnreadNotifications: false,
        };
      });
    },

    markMessagesRead: () => {
      const userId = get().currentUserId;
      if (!userId) return;

      set((state) => {
        persist(userId, state.notifications, false);
        return {
          hasUnreadMessages: false,
        };
      });
    },

    setHasUnreadMessages: (val: boolean) => {
      const userId = get().currentUserId;
      if (!userId) return;

      set((state) => {
        if (state.hasUnreadMessages === val) return state;
        persist(userId, state.notifications, val);
        return {
          hasUnreadMessages: val,
        };
      });
    },

    clearAll: () => {
      const userId = get().currentUserId;
      if (!userId) return;

      set((state) => {
        persist(userId, [], state.hasUnreadMessages);
        return {
          notifications: [],
          hasUnreadNotifications: false,
        };
      });
    },

    deleteNotification: (id: string) => {
      const userId = get().currentUserId;
      if (!userId) return;

      set((state) => {
        const updated = state.notifications.filter((n) => n.id !== id);
        const hasUnreadNotifs = updated.some((n) => !n.isRead);
        persist(userId, updated, state.hasUnreadMessages);
        return {
          notifications: updated,
          hasUnreadNotifications: hasUnreadNotifs,
        };
      });
    },

    updateNotificationAction: (id: string, action: "accepted" | "rejected") => {
      const userId = get().currentUserId;
      if (!userId) return;

      set((state) => {
        const updated = state.notifications.map((n) =>
          n.id === id ? { ...n, actionTaken: action } : n
        );
        persist(userId, updated, state.hasUnreadMessages);
        return {
          notifications: updated,
        };
      });
    },

    fetchFriendRequests: async () => {
      const userId = get().currentUserId;
      if (!userId) return;

      try {
        const reqs = await usersService.getPendingFriendRequests();
        const validReqs = reqs.filter((r: any) => r && r.senderId);

        set((state) => {
          let updated = [...state.notifications];
          let updatedNeeded = false;

          validReqs.forEach((r: any) => {
            const sender = r.senderId;
            const senderId = sender._id || sender.id || sender;
            const reqId = `friend_req_${r._id}`;

            // Check if notification already exists
            const exists = state.notifications.some((n) => n.id === reqId);
            if (!exists) {
              const newReqNotif: NotificationItem = {
                id: reqId,
                type: "friend_request",
                senderId: senderId,
                title: "Friend Request",
                desc: `${sender.name || sender.username || "Someone"} sent you a friend request.`,
                time: r.createdAt || new Date().toISOString(),
                isRead: false,
                actionTaken: null,
              };
              // Add to top
              updated = [newReqNotif, ...updated];
              updatedNeeded = true;
            }
          });

          if (updatedNeeded) {
            const hasUnreadNotifs = updated.some((n) => !n.isRead);
            persist(userId, updated, state.hasUnreadMessages);
            return {
              notifications: updated,
              hasUnreadNotifications: hasUnreadNotifs,
            };
          }

          return state;
        });
      } catch (error) {
        console.error("Failed to fetch pending friend requests in store:", error);
      }
    },
  };
});
