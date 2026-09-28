import { io, Socket } from "socket.io-client";

const MESSAGING_URL = process.env.NEXT_PUBLIC_MESSAGING_URL || "http://localhost:3004";

export function connectMessaging(
  accessToken: string,
  refreshToken: string,
  onMessage: (message: unknown) => void,
): Socket {
  const socket = io(MESSAGING_URL, {
    extraHeaders: { accesstoken: accessToken, refreshtoken: refreshToken },
  });

  socket.on("new-message", onMessage);
  return socket;
}
