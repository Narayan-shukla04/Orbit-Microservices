import jwt from "jsonwebtoken"
import { DmMessage } from "../models/dmMessage.model.js"
import { conversationId } from "../controllers/friends.controller.js"

export function registerDmSocket(io) {
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
