import { Router } from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import {
  sendRequest,
  acceptRequest,
  declineRequest,
  removeFriend,
  listFriends,
  listPending,
  getDmHistory,
  searchUsers,
} from "../controllers/friends.controller.js"

const router = Router()

router.use(authMiddleware)

router.get("/",                     listFriends)
router.get("/pending",              listPending)
router.get("/search",               searchUsers)
router.get("/dm/:friendId",         getDmHistory)
router.post("/request/:recipientId",  sendRequest)
router.patch("/accept/:friendshipId", acceptRequest)
router.patch("/decline/:friendshipId",declineRequest)
router.delete("/:friendshipId",       removeFriend)

export default router
