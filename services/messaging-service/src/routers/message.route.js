import express from "express";
import { createMessage ,getAllMessages } from "../controllers/messaeg.controller.js";
import { verifyAuth } from "../middleware/auth.middleware.js";

const router = express.Router()


router.use(verifyAuth)
// router.post("/createmessage/:channelId ",createMessage)



router.post("/createmessage/:channelId",createMessage)
router.post("/getallmessages/:channelId",getAllMessages)




export default router
