import jwt from "jsonwebtoken"
import AppError from "../utils/AppError.js"
import asyncHandler from "./asyncHandler.js"


const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken
  if (!token) throw new AppError("Not authenticated", 401)

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    throw new AppError("Invalid or expired token", 401)
  }

  req.userId = decoded.id
  next()
})

export default authMiddleware
