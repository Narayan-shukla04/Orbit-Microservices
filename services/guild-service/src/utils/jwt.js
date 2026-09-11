import jwt from "jsonwebtoken";
import env from "dotenv"
env.config()

export const jwtSign=(paylaod)=>{
    return jwt.sign({paylaod:"payload"},process.env.JWT_SECRET)
}
export const jwtDecode=(paylaod)=>{
    return jwt.decode(paylaod,process.env.JWT_SECRET)
}

