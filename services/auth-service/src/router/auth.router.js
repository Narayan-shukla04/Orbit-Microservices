import express from "express"
import upload from "../config/multer.js"
import { forgatPasswordController, googleAuthCallback, loginController, logoutController, registerController, resetPassword, testController, verifyOtp } from "../controllers/auth.controller.js"
import passport from "../utils/passport.js"
import authMiddleware from "../middleware/auth.middleware.js"
import { validate } from "../middleware/validate.middleware.js"
import { forgetPassword, loginSchema, registerSchema, resetPasswordSchema, varifyOtpSchema } from "../schema/auth.schema.js"


const router =express.Router()


router.post("/register" ,upload.single("image"), validate(registerSchema),registerController)
router.post("/login",validate(loginSchema), loginController)

router.get("/google",passport.authenticate("google",{scope:["profile","email"]}))


router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleAuthCallback
);



router.post("/forget-password",validate(forgetPassword),forgatPasswordController)
router.post("/verify-otp",validate(varifyOtpSchema), verifyOtp)
router.patch("/reset-password", validate(resetPasswordSchema), resetPassword)

router.post("/test",authMiddleware, testController)

// midilware banana he check karne ke liye ki iser sahi he ya galata
router.post("/logout",authMiddleware,logoutController)

 export default router