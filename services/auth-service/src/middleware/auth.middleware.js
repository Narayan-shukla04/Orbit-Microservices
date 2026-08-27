import jwt from "jsonwebtoken";
import appErorr from "../utils/app.Error.js";
import asyncHandler from "./asyncHandler.middleware.js";
import { userModel } from "../models/user.model.js";
import redis from "../config/redis.js";
import generateToken from "../utils/token.js";
import crypto from "crypto";

const authMiddleware = asyncHandler(async (req, res, next) => {
  let accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  let decode;


  if (accessToken) {
    decode = jwt.verify(accessToken, process.env.JWT_SECRET);
    if(!decode) decode=null
  } else {
    decode = null;
  }

  if (!decode) {
    if (!refreshToken) {
      throw new appErorr("token expired", 400);
    }

    decode = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (!decode) throw new appErorr("invalid refresh token", 401);

    
    const hasedBlacklistedToken=crypto.createHash("sha256").update(refreshToken).digest("hex")
    const blacklistedToken =await redis.get(`berrar:cookie-${decode.id}`);
    if (blacklistedToken == hasedBlacklistedToken)
      throw new appErorr("refresh token revoked", 401);

    accessToken =await generateToken(decode.id, "30min");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,

      sameSite: "strict",
      maxAge: 30 * 60 * 1000,
    });
  }

  const user = await userModel.findById(decode.id);

  if (!user) throw new appErorr("user not forund");


  req.user=user

  next()



});

export default authMiddleware;
