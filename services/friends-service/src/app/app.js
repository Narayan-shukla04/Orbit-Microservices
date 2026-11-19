import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import friendsRouter from "../routes/friends.router.js"
import errorHandler from "../middleware/error.middleware.js"

const app = express()

app.set("trust proxy", 1)

const clientOrigins = [
  ...new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map((s) => s.trim().replace(/\/$/, "")) : []),
  ]),
]

app.use(cors({
  origin: clientOrigins,
  credentials: true,
}))
app.use(cookieParser())
app.use(express.json())

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "friends-service" })
})

app.use("/api/friends", friendsRouter)

app.use(errorHandler)

export default app
