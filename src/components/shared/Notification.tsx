"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Bell, CheckCircle, Info, ShieldX, CircleX, MessageCircle, UserPlus, XCircle } from "lucide-react";
import { useNotifications } from "./useNotifications";
import { usersService } from "@/lib/api/services/users.service";

interface NotificationItem {
  id: string | number;
  type?: string;
  senderId?: string;
  title: string;
  desc: string;
  time: string;
  icon: React.ReactNode;
  actionTaken?: "accepted" | "rejected" | null;
}

export default function Notifications({ alignClass = "-right-[90px] md:right-0 w-[310px] md:w-80" }: { alignClass?: string } = {}) {
    const [isOpen, setIsOpen] = useState(false);
    const { hasUnread, markNotificationsRead } = useNotifications();
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    const [notifications, setNotifications] = useState<NotificationItem[]>([
        {
            id: "friend_req_mamdouh",
            type: "friend_request",
            senderId: "69f226188370d9ca48c19342",
            title: "Friend Request",
            desc: "Mamdouh El Bakry sent you a friend request.",
            time: "Just now",
            icon: <UserPlus size={16} className="text-teal-500" />,
            actionTaken: null,
        },
        { id: 1, title: "Profile updated", desc: "Your personal details were saved successfully.", time: "2 min ago", icon: <CheckCircle size={16} className="text-green-500" /> },
        { id: 2, title: "Welcome to Thalorix", desc: "We're glad to have you here! Explore the dashboard.", time: "1 day ago", icon: <Info size={16} className="text-blue-500" /> },
        { id: 3, title: "Profile Deleted", desc: "Your personal details were deleted successfully.", time: "2 min ago", icon: <ShieldX size={16} className="text-red-500" /> },
        { id: 4, title: "Omar", desc: "Your personal details were deleted successfully.", time: "2 min ago", icon: <MessageCircle size={16} className="text-green-500" /> },
        { id: 5, title: "Welcome to Thalorix", desc: "Hey, I think there's a mistake on my Code...", time: "5 min ago", icon: <CircleX size={16} className="text-red-500" /> }
    ]);

    const handleAcceptFriend = async (notifId: string, senderId: string) => {
        setActionLoadingId(notifId);
        try {
            await usersService.acceptFriendRequest(senderId);
            setNotifications(prev => 
                prev.map(n => n.id === notifId ? { ...n, actionTaken: "accepted" } : n)
            );
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
            setNotifications(prev => 
                prev.map(n => n.id === notifId ? { ...n, actionTaken: "rejected" } : n)
            );
        } catch (error) {
            console.error("Failed to reject friend request:", error);
        } finally {
            setActionLoadingId(null);
        }
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
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 cursor-pointer">
                                            <div className="mt-1 flex-shrink-0">
                                                {notif.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-800">{notif.title}</p>
                                                <p className="text-xs text-gray-500 mt-1 leading-normal break-words">{notif.desc}</p>
                                                
                                                {notif.type === "friend_request" && notif.actionTaken === null && (
                                                    <div className="flex gap-2 mt-2.5">
                                                        <button 
                                                            disabled={actionLoadingId !== null}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (notif.senderId) handleAcceptFriend(notif.id.toString(), notif.senderId);
                                                            }}
                                                            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[11px] font-bold shadow-sm transition-all disabled:opacity-50"
                                                        >
                                                            {actionLoadingId === notif.id ? "Accepting..." : "Accept"}
                                                        </button>
                                                        <button 
                                                            disabled={actionLoadingId !== null}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (notif.senderId) handleRejectFriend(notif.id.toString(), notif.senderId);
                                                            }}
                                                            className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-bold transition-all disabled:opacity-50"
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
                                                
                                                <p className="text-[10px] text-gray-400 mt-2">{notif.time}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-gray-500 text-sm">
                                        No new notifications
                                    </div>
                                )}
                            </div>
                            <div className="p-3 text-center border-t border-gray-100 bg-gray-50">
                                <button className="text-xs font-semibold text-[#103B40] hover:underline">View all</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
