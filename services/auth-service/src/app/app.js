import express from "express"
import cookieParser from "cookie-parser"
import globleErrorHandler from "../middleware/error.middelware.js"
import authRouter from "../router/auth.router.js"
import userRouter from "../router/user.router.js"
import passport from "../utils/passport.js"

const app = express()
app.set("trust proxy", 1)
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "auth-service" })
})

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

app.use(globleErrorHandler)

export default app