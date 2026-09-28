import express from "express"
import http from "http"
import { initializedSocket } from "../socket/socket.js"
import messageRoutes from "../routers/message.route.js"
import { createMessage } from "../controllers/messaeg.controller.js"
import { verifyAuth } from "../middleware/auth.middleware.js"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(cookieParser())





// Routes
app.use("/api/messages", messageRoutes)

const httpServer = http.createServer(app)

initializedSocket(httpServer)

export default httpServer