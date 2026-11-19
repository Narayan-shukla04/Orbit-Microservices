import { Server } from "socket.io";
import asyncHandler from "../middleware/asyncHandler.js";
import { channeldetails, serverMemberDetails } from "../services/fatchDetails.services.js";
import AppError from "../utils/App.error.js";
import { socketAuthMiddleware } from "../middleware/socketAuth.middleware.js";

let io;

export const initializedSocket = (server) => {
  const clientOrigins = [
    ...new Set([
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map((s) => s.trim().replace(/\/$/, "")) : []),
    ]),
  ];

  io = new Server(server, {
    cors: {
      origin: clientOrigins,
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log("socket connected:", socket.id, "userId:", socket.user);

    socket.on("join-channel", async (channelId) => {
      try {
        if (!channelId) return;
        socket.join(`channel-${channelId}`);
        console.log(`Socket ${socket.id} joined channel-${channelId}`);
      } catch (error) {
        console.error("Error joining channel socket:", error.message);
      }
    });

    socket.on("leave-channel", async (channelId) => {
      try {
        if (!channelId) return;
        socket.leave(`channel-${channelId}`);
        console.log(`Socket ${socket.id} left channel-${channelId}`);
      } catch (error) {
        console.error("Error leaving channel socket:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected", socket.id);
    });
  });
};

export const getIo=()=>{
  if(!io) throw new AppError(500,"socket io not initialized")
  return io;
}