import redisClient from "../config/redis.js";
import jwt from "jsonwebtoken"
import env from "dotenv"


env.config()

export const socketAuthMiddleware = async (socket, next) => {
    try {
        let token =
            socket.handshake.auth?.token ||
            socket.handshake.auth?.accessToken ||
            socket.handshake.headers?.accesstoken;

        if (!token && socket.handshake.headers?.cookie) {
            const rawCookie = socket.handshake.headers.cookie;
            const cookies = Object.fromEntries(
                rawCookie.split(";").map(c => {
                    const [k, ...v] = c.trim().split("=");
                    return [k, v.join("=")];
                })
            );
            token = cookies.accessToken;
        }

        if (!token) return next(new Error("unauthorized: no token"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) return next(new Error("unauthorized: invalid token"));

        const blacklisted = await redisClient.get(`berrar:cookie-${decoded.id}`);
        if (blacklisted === decoded.id) return next(new Error("refresh token revoked"));

        socket.user = decoded.id;
        console.log("socket authenticated, userId:", socket.user);
        next();
    } catch (err) {
        return next(new Error("unauthorized: invalid token"));
    }
};
