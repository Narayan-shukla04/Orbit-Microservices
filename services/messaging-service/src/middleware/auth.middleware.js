import AppError from "../utils/App.error.js";
import asyncHandler from "./asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyAuth=asyncHandler((req,res,next)=>{
const token =req.cookies.accessToken

if(!token) throw new AppError("404", "token required")


    const decode = jwt.verify(token,process.env.JWT_SECRET)

    if(!decode) throw new AppError(401,"unauthorized")


        req.user = decode.id

        next()
})