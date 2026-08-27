import express from "express"
import upload from "../config/multer.js"
import { forgatPasswordController, googleAuthCallback, loginController, logoutController, registerController, resetPassword, testController, verifyOtp } from "../controllers/auth.controller.js"
import passport from "../utils/passport.js"
import authMiddleware from "../middleware/auth.middleware.js"


const router =express.Router()


router.post("/register", upload.single("image"), registerController)
router.post("/login",loginController)

router.get("/google",passport.authenticate("google",{scope:["profile","email"]}))


router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleAuthCallback
);



router.post("/forget-password",forgatPasswordController)
router.post("/verify-otp", verifyOtp)
router.patch("/reset-password", resetPassword)

router.post("/test",authMiddleware, testController)

// midilware banana he check karne ke liye ki iser sahi he ya galata
router.post("/logout",authMiddleware,logoutController)

 export default router