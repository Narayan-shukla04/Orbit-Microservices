import rateLimit  from "express-rate-limit"


export const limiter =rateLimit({
    windowMs: 60*1000,
    max:100,
    standardHeaders:"draft-8",
    legacyHeaders:"false",
    message:"too many request from this ip"
})
