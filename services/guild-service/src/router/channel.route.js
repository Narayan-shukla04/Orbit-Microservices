import express from "express";
import { verifyAuthUser } from "../middlewares/auth.middleware.js";
import { createChannel, exportChannelDetailsController, getchannelController, updateChannelController } from "../controllers/channel.controller.js";


const router= express.Router()

// export in other services

router.post("/export/channeldetails",exportChannelDetailsController)

router.use(verifyAuthUser)

router.post("/create",createChannel)
router.patch("/update/:channelid",updateChannelController)
router.post("/getchannels/:serverId",getchannelController)






export default router