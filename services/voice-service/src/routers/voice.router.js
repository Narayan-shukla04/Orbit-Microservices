import express from "express"  
import authMiddleware from "../middlewares/auth.middleware.js"
import getJoinController, { getActiveParticipantsController } from "../controllers/voice.controller.js"

const router = express.Router()

router.use(authMiddleware)
router.post("/token", getJoinController)
router.get("/participants", getActiveParticipantsController)

export default router