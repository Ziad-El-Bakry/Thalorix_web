"use client";

import { useState, useEffect } from "react";

// Global state map to link all instances
let unreadNotifications = true;
let unreadMessages = false;
const listeners = new Set<() => void>();

function notifyListeners() {
    listeners.forEach(listener => listener());
}

export function useNotifications() {
    const [state, setState] = useState({
        unreadNotifications,
        unreadMessages
    });

    useEffect(() => {
        const listener = () => {
            setState({
                unreadNotifications,
                unreadMessages
            });
        };
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }, []);

    const markNotificationsRead = () => {
        if (unreadNotifications) {
            unreadNotifications = false;
            notifyListeners();

            // Simulate arriving message after a delay if they've checked their notifications
            setTimeout(() => {
                unreadMessages = true;
                notifyListeners();
            }, 4000); // 4 seconds after opening notifications
        }
    };

    const markMessagesRead = () => {
        if (unreadMessages) {
            unreadMessages = false;
            notifyListeners();
        }
    };

    return {
        hasUnread: state.unreadNotifications,
        hasUnreadMessages: state.unreadMessages,
        markNotificationsRead,
        markMessagesRead
    };
}
