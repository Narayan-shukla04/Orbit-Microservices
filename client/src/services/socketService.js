import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || undefined;
    socket = io(socketUrl, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.warn("[Socket] Connect error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });
  }
  return socket;
};

export const joinChannel = (channelId) => {
  if (!channelId) return;
  const s = getSocket();
  s.emit("join-channel", channelId);
};

export const leaveChannel = (channelId) => {
  if (!channelId) return;
  const s = getSocket();
  s.emit("leave-channel", channelId);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
