import express from "express"
import http from "http"
import { initializedSocket } from "../socket/socket.js"
import messageRoutes from "../routers/message.route.js"
import { createMessage } from "../controllers/messaeg.controller.js"
import { verifyAuth } from "../middleware/auth.middleware.js"
import cookieParser from "cookie-parser"

const app = express()

app.set("trust proxy", 1)
app.use(express.json())
app.use(cookieParser())

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "messaging-service" })
})





// Routes
app.use("/api/messages", messageRoutes)

const httpServer = http.createServer(app)

initializedSocket(httpServer)

export default httpServer