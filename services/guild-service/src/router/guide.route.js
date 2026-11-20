import express, { Router } from "express";
import { verifyAuthUser } from "../middlewares/auth.middleware.js";
import { createServerController, deleteServerController, generateInviteCodeController, getchannelMemberDetailsController, getServerController, joinServerController, kickMembercontroller, leaveServer, serverDetailcontroller } from "../controllers/guide.controller.js";
import upload from "../config/multer.js";


const router = express.Router()

router.use(verifyAuthUser)
router.post("/export/channel-member",getchannelMemberDetailsController)


router.post("/create",upload.fields([{name :"icon",maxCount:1},{name :"banner",maxCount:1}]),createServerController)

router.get("/getserver",getServerController)
router.get("/getserver-details",serverDetailcontroller)

router.post("/join-server/:invitecode",joinServerController)
router.post("/invite/generate", generateInviteCodeController)

router.delete("/delete-server",deleteServerController)

router.post("/kick/:serverid/:user",kickMembercontroller)

router.post("/leave-server", leaveServer)









export default router