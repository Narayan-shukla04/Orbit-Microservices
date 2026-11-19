import express from "express";
import { verifyAuthUser } from "../middlewares/auth.middleware.js";
import { createRoleController, deleteRoleController, getAllRolesController, updateRoleController } from "../controllers/role.controller.js";

const router= express.Router()

router.use(verifyAuthUser)


router.post("/create/:serverId",createRoleController)
router.patch("/update/:serverId",updateRoleController)
router.get("/getroles/:serverId",getAllRolesController)
router.delete("/delete/:serverId",deleteRoleController)


export default router