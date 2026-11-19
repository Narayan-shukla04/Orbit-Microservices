import jwt from "jsonwebtoken";
import appErorr from "../utils/app.Error.js";
import asyncHandler from "./asyncHandler.middleware.js";
import { userModel } from "../models/user.model.js";
import redis from "../config/redis.js";
import generateToken from "../utils/token.js";
import crypto from "crypto";

const isProd = process.env.NODE_ENV === "production";
const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  ...(maxAge !== undefined ? { maxAge } : {}),
});

const authMiddleware = asyncHandler(async (req, res, next) => {

  let accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  let decode;


  if (accessToken) {
    try {
      decode = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch {
      decode = null;
    }
  } else {
    decode = null;
  }

  if (!decode) {
    if (!refreshToken) {
      throw new appErorr("token expired", 401);
    }

    try {
      decode = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch {
      throw new appErorr("invalid refresh token", 401);
    }

    
    const hasedBlacklistedToken=crypto.createHash("sha256").update(refreshToken).digest("hex")
    const blacklistedToken =await redis.get(`berrar:cookie-${decode.id}`);
    if (blacklistedToken == hasedBlacklistedToken)
      throw new appErorr("refresh token revoked", 401);

    accessToken =await generateToken(decode.id, "30min");

    res.cookie("accessToken", accessToken, getCookieOptions(30 * 60 * 1000));
  }

  const user = await userModel.findById(decode.id);

  if (!user) throw new appErorr("user not forund");


  req.user=user



  next()



});

export default authMiddleware;
