import http from 'http';
import { Server } from 'socket.io';
import { app } from './app';
import { initializeSocket } from './socket/index';

const PORT = process.env.PORT || 8888;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

initializeSocket(io);

server.listen(PORT, () => {
    console.log(`🚀 SchoolOS Server active on port ${PORT}`);
});
