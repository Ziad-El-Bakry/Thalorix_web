"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, Info, MessageCircle, UserPlus, XCircle, CircleX, Trash2 } from "lucide-react";
import { useNotifications } from "./useNotifications";
import { useNotificationStore, NotificationItem } from "@/store/useNotificationStore";
import { usersService } from "@/lib/api/services/users.service";
import { formatters } from "@/lib/utils/formatters";

// Helper to get the correct icon for each notification type
const getNotificationIcon = (type?: string) => {
  switch (type) {
    case "success":
      return <CheckCircle size={16} className="text-green-500 flex-shrink-0" />;
    case "error":
      return <CircleX size={16} className="text-red-500 flex-shrink-0" />;
    case "message":
      return <MessageCircle size={16} className="text-[#43B0B5] flex-shrink-0" />;
    case "friend_request":
      return <UserPlus size={16} className="text-teal-500 flex-shrink-0" />;
    case "info":
    default:
      return <Info size={16} className="text-blue-500 flex-shrink-0" />;
  }
};

interface NotificationsProps {
  alignClass?: string;
}

export default function Notifications({ alignClass = "-right-[90px] md:right-0 w-[310px] md:w-80" }: NotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { hasUnread, markNotificationsRead } = useNotifications();
  const store = useNotificationStore();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      store.fetchFriendRequests();
    }
  }, [isOpen]);

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

  const handleDeleteNotif = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    store.deleteNotification(id);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(!isOpen);
          markNotificationsRead();
        }}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
      >
        <Bell size={24} />
        {hasUnread && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay to close when clicking outside */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`absolute ${alignClass} top-12 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-[100] overflow-hidden`}
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-[#103B40]">Notifications</h3>
                {hasUnread && (
                  <span className="bg-[#103B40] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">New</span>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto sidebar-scrollbar">
                {store.notifications.length > 0 ? (
                  store.notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50/80 transition-colors flex gap-3 cursor-pointer group relative ${
                        !notif.isRead ? "bg-teal-50/10" : ""
                      }`}
                    >
                      <div className="mt-1 flex-shrink-0">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <p className={`text-sm text-gray-800 ${!notif.isRead ? "font-semibold" : "font-medium"}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 leading-normal break-words">
                          {notif.desc}
                        </p>

                        {notif.type === "friend_request" && notif.actionTaken === null && (
                          <div className="flex gap-2 mt-2.5">
                            <button
                              disabled={actionLoadingId !== null}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (notif.senderId) handleAcceptFriend(notif.id, notif.senderId);
                              }}
                              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[11px] font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                            >
                              {actionLoadingId === notif.id ? "Accepting..." : "Accept"}
                            </button>
                            <button
                              disabled={actionLoadingId !== null}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (notif.senderId) handleRejectFriend(notif.id, notif.senderId);
                              }}
                              className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-bold transition-all disabled:opacity-50 cursor-pointer"
                            >
                              Decline
                            </button>
                          </div>
                        )}

                        {notif.type === "friend_request" && notif.actionTaken === "accepted" && (
                          <motion.p
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1"
                          >
                            <CheckCircle size={14} /> Request Accepted!
                          </motion.p>
                        )}

                        {notif.type === "friend_request" && notif.actionTaken === "rejected" && (
                          <motion.p
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-xs font-bold text-red-600 mt-2 flex items-center gap-1"
                          >
                            <XCircle size={14} /> Request Declined
                          </motion.p>
                        )}

                        <p className="text-[10px] text-gray-400 mt-2">
                          {formatters.relativeTime(notif.time)}
                        </p>
                      </div>

                      {/* Delete notification button */}
                      <button
                        onClick={(e) => handleDeleteNotif(e, notif.id)}
                        className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded transition-all hover:bg-red-50 cursor-pointer"
                        title="Delete notification"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-400 text-sm">
                    No new notifications
                  </div>
                )}
              </div>
              <div className="p-3 text-center border-t border-gray-100 bg-gray-50">
                <Link
                  href="/dashboard/notifications"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold text-[#103B40] hover:underline block w-full py-0.5"
                >
                  View all
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
