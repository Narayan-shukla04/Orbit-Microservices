import http from "http"
import { Server } from "socket.io"
import dotenv from "dotenv"
import app from "./src/app/app.js"
import { connectDB } from "./src/config/db.js"
import { registerDmSocket } from "./src/socket/dm.socket.js"

dotenv.config()

const port = process.env.PORT || 3006

const httpServer = http.createServer(app)

const clientOrigins = [
  ...new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map((s) => s.trim().replace(/\/$/, "")) : []),
  ]),
]

const io = new Server(httpServer, {
  cors: {
    origin: clientOrigins,
    credentials: true,
  },
})

registerDmSocket(io)

connectDB().then(() => {
  httpServer.listen(port, () => {
    console.log(`friends-service listening on port ${port}`)
  })
})
