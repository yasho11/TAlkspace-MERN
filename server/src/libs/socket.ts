import {Server} from "socket.io";
import http from "http";
import express from "express";


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
})

interface UserSocketMap {
    [userId: string]: string;
}

export function getReceiverSocketId(userId: string): string | undefined {
    return userSocketMap[userId];
}

const userSocketMap: Record<string, string> = {};

io.on("connection", (socket)=>{
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;

    if (typeof userId === "string") userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () =>{
        console.log("A user disconnected", socket.id);
        if (typeof userId === "string") {
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export {io , app , server};
