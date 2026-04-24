import { io, Socket } from 'socket.io-client';

const getSocketUrl = () => {
    // 1. Use VITE_SOCKET_URL if explicitly set (e.g. for a specific EC2 IP or domain)
    if (import.meta.env.VITE_SOCKET_URL) {
        return import.meta.env.VITE_SOCKET_URL;
    }

    // 2. Default to current origin to allow Vite/Nginx proxies to handle it
    // This is most robust for tunnels and different networks
    return window.location.origin;
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
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            transports: ['websocket', 'polling'],
        });

        socket.on('connect', () => {
            console.log('[SOCKET] ✅ Connected with ID:', socket?.id);
        });

        socket.on('disconnect', (reason) => {
            console.log('[SOCKET] ❌ Disconnected:', reason);
        });

        socket.on('connect_error', (error) => {
            console.error('[SOCKET] ⚠️ Connection error:', error.message);
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
