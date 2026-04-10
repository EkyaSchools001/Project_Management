import { io, Socket } from 'socket.io-client';

const getSocketUrl = () => {
    const origin = window.location.origin;

    // Use VITE_SOCKET_URL if available (explicitly points to EC2 IP)
    if (import.meta.env.VITE_SOCKET_URL) {
        return import.meta.env.VITE_SOCKET_URL;
    }

    // Fallback: If VITE_API_URL is set, derive socket URL from it
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL.replace(/\/api.*$/, '');
    }

    return origin;
};

const API_URL = getSocketUrl();

let socket: Socket | null = null;

console.log('[SOCKET] Initializing socket client, URL:', API_URL);

export const connectSocket = (token?: string) => {
    const authToken = token || sessionStorage.getItem('auth_token');

    if (!socket) {
        console.log('[SOCKET] Creating new socket connection');

        socket = io(API_URL, {
            auth: { token: authToken },
            reconnection: true,
            reconnectionAttempts: 2,
            reconnectionDelay: 5000,
            transports: ['websocket', 'polling'],
        });

        socket.on('connect', () => {
            console.log('[SOCKET] ✅ Connected with ID:', socket?.id);
        });

        socket.on('disconnect', (reason) => {
            console.log('[SOCKET] ❌ Disconnected:', reason);
        });

        socket.on('connect_error', () => {
            // Suppress verbose connection errors if server is unavailable
        });

        socket.on('SETTINGS_UPDATED', (data: any) => {
            console.log('[SOCKET] 📡 Event received:', data);
        });
    }

    return socket;
};

export const getSocket = () => {
    if (!socket) {
        socket = connectSocket();
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
