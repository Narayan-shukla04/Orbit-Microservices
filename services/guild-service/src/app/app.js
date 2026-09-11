import express from "express"
import dotenv from "dotenv"
import  guildRoutes  from "../router/guide.route.js";
import globleErrorHandler from "../middlewares/error.middleware.js"
import channelRoutes from "../router/channel.route.js"
import roleRoutes from "../router/role.route.js";
import cookieParser from "cookie-parser";

dotenv.config()


const app =express()

app.use(express.json())
app.use(cookieParser())




app.use("/api/server",guildRoutes)
app.use("/api/server/channel",channelRoutes)
app.use("/api/server/role",roleRoutes)

app.use(globleErrorHandler)








export default app