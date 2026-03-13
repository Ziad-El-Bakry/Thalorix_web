"use client";

import { useState, useEffect } from "react";

let globalIsChatOpen = false;
const listeners = new Set<() => void>();

function notifyListeners() {
    listeners.forEach(listener => listener());
}

export function useChatState() {
    const [isChatOpen, set] = useState(globalIsChatOpen);

    useEffect(() => {
        const listener = () => set(globalIsChatOpen);
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }, []);

    const setIsChatOpen = (isOpen: boolean) => {
        if (globalIsChatOpen !== isOpen) {
            globalIsChatOpen = isOpen;
            notifyListeners();
        }
    };

    return {
        isChatOpen,
        setIsChatOpen
    };
}
