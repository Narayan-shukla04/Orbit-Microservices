import express from "express";
import { verifyAuthUser } from "../middlewares/auth.middleware.js";
import { createChannel, getchannelController, updateChannelController } from "../controllers/channel.controller.js";


const router= express.Router()


router.use(verifyAuthUser)



router.post("/create",createChannel)
router.patch("/update/:channelid",updateChannelController)
router.patch("/getchannels/:serverId",getchannelController)






export default router