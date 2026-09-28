import redisClient from "../config/redis.js";
import jwt from "jsonwebtoken"
import env from "dotenv"


env.config()

export const socketAuthMiddleware = async (socket, next) => {
    const { accesstoken, refreshtoken } = socket.handshake.headers


    if (!accesstoken || !refreshtoken) return next(new Error("unauthorized: no token"))

    let decoded;

    try {
        decoded = jwt.verify(accesstoken, process.env.JWT_SECRET)


        if (!decoded) throw new appError(404, "invalid token")

        const blacklisted = await redisClient.get(`berrar:cookie-${decoded.id}`)
        if (blacklisted === decoded.id) return next(new Error("refresh token revoked"))
        socket.user = decoded.id
        console.log("socket authenticated, userId:", socket.user)
        next()
    } catch (err) {
        return next(new Error("unauthorized: invalid token"))
    }


}
