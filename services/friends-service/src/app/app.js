import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import friendsRouter from "../routes/friends.router.js"
import errorHandler from "../middleware/error.middleware.js"

const app = express()

app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
  credentials: true,
}))
app.use(cookieParser())
app.use(express.json())

app.use("/api/friends", friendsRouter)

app.use(errorHandler)

export default app
