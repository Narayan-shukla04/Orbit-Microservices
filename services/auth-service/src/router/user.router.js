import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { detailUpdateController, getme } from "../controllers/user.controller.js"


const router = express.Router()


router.get("/getme",authMiddleware,getme)

router.patch("/update-details",authMiddleware,detailUpdateController)



export default router