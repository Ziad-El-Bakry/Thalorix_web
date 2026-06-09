// lib/socket.ts
import { io } from 'socket.io-client';

// Get WebSocket URL from environment
const isProd = typeof window !== 'undefined' ? window.location.hostname !== 'localhost' : process.env.NODE_ENV === 'production';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 
               process.env.NEXT_PUBLIC_SOCKET_URL || 
               (isProd ? 'https://pleny-task.onrender.com' : 'http://localhost:5001');

// Create WebSocket connection
export const socket = io(WS_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

// Log for debugging
console.log('📡 WebSocket URL:', WS_URL);

// Event listeners
socket.on('connect', () => {
  console.log('✅ WebSocket connected:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('❌ WebSocket connection error:', error.message);
});

socket.on('disconnect', () => {
  console.log('⚠️ WebSocket disconnected');
});

// Export for use in components
export default socket;