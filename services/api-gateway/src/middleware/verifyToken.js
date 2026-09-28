import jwt from "jsonwebtoken";

// const publicRouts = ["api/auth/login", "api/auth/register", "api/auth/refresh"];

export const verifyToken = (req, res, next) => {
//   if (publicRouts.some((elem) => req.path.startsWith(elem))) return next();

try {
    
    const {accessToken}=req.cookies


    if(!accessToken) return res.status(401).json({
        success:false,
        message:"unauthrized"
    })


    const decode=jwt.verify(accessToken,process.env.JWT_SECRET)

    if(!decode) return res.status(409).json({
        success:false,
        message:"forbidden"
    })


    req.headers.user=decode.id

    next()
    


} catch (error) {
    res.status(500).json({
        success:false,
        message:"internal server error",
        error:error.message
    })
    
}



};
