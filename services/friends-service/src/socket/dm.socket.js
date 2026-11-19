import jwt from "jsonwebtoken"
import { DmMessage } from "../models/dmMessage.model.js"
import { conversationId } from "../controllers/friends.controller.js"

/**
 * Socket.IO handler for 1-on-1 DMs.
 *
 * Auth: reads accessToken cookie that Socket.IO forwards on the handshake.
 * Room: each DM conversation uses a stable room = conversationId(userA, userB).
 *
 * Events (client → server):
 *   dm:join   { friendId }              — join the DM room with this friend
 *   dm:send   { friendId, content }     — send a message
 *
 * Events (server → client):
 *   dm:message  { _id, sender, content, createdAt }  — new message in room
 *   dm:error    { message }
 */
export function registerDmSocket(io) {
  // Authenticate on handshake
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.cookie
          ?.split(";")
          .find((c) => c.trim().startsWith("accessToken="))
          ?.split("=")[1]

      if (!token) return next(new Error("Not authenticated"))
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.userId = decoded.id
      next()
    } catch {
      next(new Error("Invalid token"))
    }
  })

  io.on("connection", (socket) => {
    socket.on("dm:join", ({ friendId }) => {
      if (!friendId) return
      const room = conversationId(socket.userId, friendId)
      socket.join(room)
    })

    socket.on("dm:send", async ({ friendId, content }) => {
      if (!friendId || !content?.trim()) return

      const room = conversationId(socket.userId, friendId)
      try {
        const msg = await DmMessage.create({
          conversationId: room,
          sender: socket.userId,
          content: content.trim(),
        })
        // Emit to both users in the room
        io.to(room).emit("dm:message", {
          _id: msg._id,
          sender: socket.userId,
          content: msg.content,
          createdAt: msg.createdAt,
        })
      } catch (err) {
        socket.emit("dm:error", { message: "Failed to send message" })
      }
    })
  })
}
