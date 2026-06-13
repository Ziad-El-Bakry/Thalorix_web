import { useEffect, useState, useCallback } from "react";
import { socket } from "@/lib/socket";

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Sync current state
    setIsConnected(socket.connected);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    socket.emit(event, data);
  }, []);

  const listen = useCallback((event: string, callback: (...args: any[]) => void) => {
    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  }, []);

  return {
    socket,
    isConnected,
    emit,
    listen,
  };
};