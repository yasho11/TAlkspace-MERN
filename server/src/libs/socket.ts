import { Server} from "socket.io";
import http from "http";
import express from "express";


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

export function getReceiverSocketId(userId: string) {
    return userSocketMap[userId];
}

const userSocketMap: Record<string, string> = {}; // {userId: socketId}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId as string;

    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log("User added:", userId);
    }

    console.log("All connected users:", userSocketMap);
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // FIX: Event name

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);

        // Get userId from the map before deleting
        const disconnectedUserId = Object.keys(userSocketMap).find(
            (key) => userSocketMap[key] === socket.id
        );

        if (disconnectedUserId) {
            delete userSocketMap[disconnectedUserId];
        }

        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // FIX: Use correct event name
    });
});

export {io, app, server};



