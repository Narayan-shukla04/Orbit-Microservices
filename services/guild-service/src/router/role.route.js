import express from "express";
import { createRoleController, deleteRoleController, getAllRolesController, updateRoleController } from "../controllers/role.controller.js";

const router= express.Router()


router.post("/create/:serverId",createRoleController)
router.patch("/update/:serverId",updateRoleController)
router.get("/getroles/:serverId",getAllRolesController)
router.delete("/delete/:serverId",deleteRoleController)


export default router