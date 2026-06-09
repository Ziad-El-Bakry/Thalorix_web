"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellOff,
  CheckCircle,
  CircleX,
  MessageCircle,
  UserPlus,
  Info,
  Trash2,
  Check,
  ChevronRight,
  User,
} from "lucide-react";
import { useNotificationStore, NotificationItem } from "@/store/useNotificationStore";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/lib/api/services/auth.service";
import { usersService } from "@/lib/api/services/users.service";
import { formatters } from "@/lib/utils/formatters";

type FilterType = "all" | "message" | "alert" | "friend_request";

export default function NotificationsPage() {
  const store = useNotificationStore();
  const storeUserId = useAuthStore((state) => state.currentUserId);
  const user = authService.getStoredUser();
  const currentUserId = storeUserId || user?.id || null;

  const [activeTab, setActiveTab] = useState<FilterType>("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Initialize notifications if not already done
  useEffect(() => {
    if (currentUserId) {
      store.initNotifications(currentUserId);
      store.fetchFriendRequests();
    }
  }, [currentUserId]);

  const handleAcceptFriend = async (notifId: string, senderId: string) => {
    setActionLoadingId(notifId);
    try {
      await usersService.acceptFriendRequest(senderId);
      store.updateNotificationAction(notifId, "accepted");
    } catch (error) {
      console.error("Failed to accept friend request:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectFriend = async (notifId: string, senderId: string) => {
    setActionLoadingId(notifId);
    try {
      await usersService.rejectFriendRequest(senderId);
      store.updateNotificationAction(notifId, "rejected");
    } catch (error) {
      console.error("Failed to reject friend request:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter notifications
  const filteredNotifications = store.notifications.filter((notif) => {
    if (activeTab === "all") return true;
    if (activeTab === "message") return notif.type === "message";
    if (activeTab === "friend_request") return notif.type === "friend_request";
    if (activeTab === "alert") {
      return notif.type === "info" || notif.type === "success" || notif.type === "error";
    }
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return (
          <div className="p-2 bg-green-50 rounded-lg text-green-500">
            <CheckCircle size={20} />
          </div>
        );
      case "error":
        return (
          <div className="p-2 bg-red-50 rounded-lg text-red-500">
            <CircleX size={20} />
          </div>
        );
      case "message":
        return (
          <div className="p-2 bg-teal-50 rounded-lg text-[#43B0B5]">
            <MessageCircle size={20} />
          </div>
        );
      case "friend_request":
        return (
          <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
            <UserPlus size={20} />
          </div>
        );
      case "info":
      default:
        return (
          <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
            <Info size={20} />
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:py-8 lg:px-8 min-h-[calc(100vh-100px)]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#103B40] flex items-center gap-3">
            <Bell className="text-[#43B0B5] stroke-[2.5]" />
            Notifications
          </h1>
          <p className="text-gray-500 text-sm mt-1.5">
            Manage your alerts, friend requests, and messages activity.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {store.hasUnreadNotifications && (
            <button
              onClick={() => store.markNotificationsRead()}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold border border-gray-200 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Check size={16} />
              Mark all as read
            </button>
          )}
          {store.notifications.length > 0 && (
            <button
              onClick={() => store.clearAll()}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100/80 text-red-600 text-sm font-semibold border border-red-100 rounded-xl transition-all cursor-pointer"
            >
              <Trash2 size={16} />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-150 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
        {(
          [
            { id: "all", label: "All", count: store.notifications.length },
            {
              id: "message",
              label: "Messages",
              count: store.notifications.filter((n) => n.type === "message").length,
            },
            {
              id: "friend_request",
              label: "Friend Requests",
              count: store.notifications.filter((n) => n.type === "friend_request").length,
            },
            {
              id: "alert",
              label: "System Alerts",
              count: store.notifications.filter(
                (n) => n.type === "info" || n.type === "success" || n.type === "error"
              ).length,
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? "border-[#43B0B5] text-[#103B40]"
                : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.id
                    ? "bg-[#103B40] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notif) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={notif.id}
                  className={`p-5 flex gap-4 transition-colors relative group ${
                    !notif.isRead ? "bg-teal-50/5" : ""
                  }`}
                >
                  {/* Notification Unread Dot */}
                  {!notif.isRead && (
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                  )}

                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <h3 className={`text-base text-gray-900 ${!notif.isRead ? "font-bold" : "font-semibold"}`}>
                        {notif.title}
                      </h3>
                      <span className="text-xs text-gray-400 font-medium">
                        {formatters.relativeTime(notif.time)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                      {notif.desc}
                    </p>

                    {/* Friend Request Action buttons */}
                    {notif.type === "friend_request" && notif.actionTaken === null && (
                      <div className="flex items-center gap-3 mt-4">
                        <button
                          disabled={actionLoadingId !== null}
                          onClick={() => {
                            if (notif.senderId) handleAcceptFriend(notif.id, notif.senderId);
                          }}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {actionLoadingId === notif.id ? "Accepting..." : "Accept"}
                        </button>
                        <button
                          disabled={actionLoadingId !== null}
                          onClick={() => {
                            if (notif.senderId) handleRejectFriend(notif.id, notif.senderId);
                          }}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {notif.type === "friend_request" && notif.actionTaken === "accepted" && (
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs mt-3 bg-emerald-50 w-fit px-3 py-1.5 rounded-lg">
                        <CheckCircle size={14} /> Friend Request Accepted
                      </div>
                    )}

                    {notif.type === "friend_request" && notif.actionTaken === "rejected" && (
                      <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs mt-3 bg-red-50 w-fit px-3 py-1.5 rounded-lg">
                        <CircleX size={14} /> Request Declined
                      </div>
                    )}

                    {/* Chat messaging fast redirect */}
                    {notif.type === "message" && (
                      <Link
                        href={`/dashboard/messages?user=${notif.senderId}`}
                        className="inline-flex items-center gap-1 text-[#43B0B5] hover:text-[#103B40] font-bold text-xs mt-3 transition-colors"
                      >
                        Reply in Chat
                        <ChevronRight size={14} />
                      </Link>
                    )}
                  </div>

                  {/* Individual Delete Button */}
                  <button
                    onClick={() => store.deleteNotification(notif.id)}
                    className="absolute right-4 top-5 opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    title="Delete Notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-16 text-center flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4 border border-dashed border-gray-200">
                <BellOff size={28} />
              </div>
              <h3 className="text-lg font-bold text-[#103B40]">
                All caught up!
              </h3>
              <p className="text-gray-500 text-sm mt-1.5 max-w-sm mx-auto">
                No notifications found in the {activeTab === "all" ? "" : `"${activeTab}" `}category. New alerts will show up here.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
