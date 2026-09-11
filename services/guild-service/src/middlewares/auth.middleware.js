import { appError } from "../utils/appError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncHandler.middleware.js";

export const verifyAuthUser = asyncHandler((req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) throw new appError(401, "unauthrized");

  {
    const decode = jwt.verify(accessToken, process.env.JWT_SECRET);

    if (!decode) throw new appError(401, "unauthrized");

    req.user = decode.id;
    next();
  
}})
