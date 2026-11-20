import express from "express"
import dotenv from "dotenv"
import  guildRoutes  from "../router/guide.route.js";
import globleErrorHandler from "../middlewares/error.middleware.js"
import channelRoutes from "../router/channel.route.js"
import roleRoutes from "../router/role.route.js";
import cors from "cors"

import cookieParser from "cookie-parser";

dotenv.config()


const app = express()

app.set("trust proxy", 1)
app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "guild-service" })
})





app.use("/api/server/channel",channelRoutes)
app.use("/api/server/role",roleRoutes)
app.use("/api/server",guildRoutes)

app.use(globleErrorHandler)








export default app