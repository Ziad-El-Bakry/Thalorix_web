import { io, Socket } from "socket.io-client";
import { authService } from "./auth.service";

class SocketService {
  private socket: Socket | null = null;
  
  connect() {
    if (this.socket?.connected) return this.socket;
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) return null;

    const baseURL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

    this.socket = io(`${baseURL}/chat`, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return this.socket;
  }

  getSocket() {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
