import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import voiceRouter from "../routers/voice.router.js"
import globleErrorHandler from "../middlewares/error.middleware.js"

const app = express()

app.set("trust proxy", 1)
app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "voice-service" })
})

app.use("/api/calls", voiceRouter)

app.use(globleErrorHandler)

export default app
