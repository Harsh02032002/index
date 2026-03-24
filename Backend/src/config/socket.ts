import { Server } from "socket.io";
import { env } from "./env";
import { Server as HTTPServer } from "http";

export const initSocket = (server: HTTPServer): Server => {
  const io = new Server(server, {
    cors: {
      origin: env.SOCKET_CORS_ORIGIN,
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io;
};