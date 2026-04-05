"use client";

import { useState, useEffect, useCallback } from "react";

const AVATAR_KEY = "thalorix_user_avatar";
const DEFAULT_AVATAR = "/images/avatar.png";

// Simple event-based sync across components
const listeners = new Set<(url: string) => void>();

function notifyListeners(url: string) {
  listeners.forEach((fn) => fn(url));
}

/**
 * Global avatar hook — persists to localStorage and syncs across all components.
 */
export function useAvatar() {
  const [avatar, setAvatarState] = useState<string>(DEFAULT_AVATAR);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AVATAR_KEY);
      if (stored) setAvatarState(stored);
    } catch {}
  }, []);

  // Listen for updates from other components
  useEffect(() => {
    const handler = (url: string) => setAvatarState(url);
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  const setAvatar = useCallback((dataUrl: string) => {
    try {
      localStorage.setItem(AVATAR_KEY, dataUrl);
    } catch (e) {
      console.warn("Could not save avatar to localStorage:", e);
    }
    setAvatarState(dataUrl);
    notifyListeners(dataUrl);
  }, []);

  return { avatar, setAvatar };
}
