import { io } from "socket.io-client"

/**
 * Separate Socket.IO client for DMs (friends-service, port 3006).
 * Kept separate from the guild socket so the two don't interfere.
 */
let dmSocket = null

export const getDmSocket = () => {
  if (!dmSocket) {
    const dmUrl = import.meta.env.VITE_FRIENDS_SOCKET_URL || (import.meta.env.PROD ? undefined : "http://localhost:3006")
    dmSocket = io(dmUrl, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    dmSocket.on("connect",       () => console.log("[DM Socket] connected:", dmSocket.id))
    dmSocket.on("connect_error", (e) => console.warn("[DM Socket] error:", e.message))
    dmSocket.on("disconnect",    (r) => console.log("[DM Socket] disconnected:", r))
  }
  return dmSocket
}

export const joinDm = (friendId) => {
  if (!friendId) return
  getDmSocket().emit("dm:join", { friendId })
}

export const sendDm = (friendId, content) => {
  if (!friendId || !content?.trim()) return
  getDmSocket().emit("dm:send", { friendId, content })
}

export const disconnectDmSocket = () => {
  if (dmSocket) {
    dmSocket.disconnect()
    dmSocket = null
  }
}
