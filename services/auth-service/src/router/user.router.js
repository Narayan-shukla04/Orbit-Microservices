import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  changePasswordController,
  detailUpdateController,
  getme,
  getUsers,
  updateProfile,userDetailsById,sendingUsersDetails
} from "../controllers/user.controller.js";
import upload from "../config/multer.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  changePasswordSchema,
  detailControllerSchema,
} from "../schema/user.schema.js";

const router = express.Router();

router.post("/export/mydetails", userDetailsById)
router.post("/export/usersdetails",sendingUsersDetails)



router.get("/getme", authMiddleware, getme);
router.post("/getuser", getUsers)

router.patch(
  "/update-details",
  authMiddleware,
  validate(detailControllerSchema),
  detailUpdateController,
);
router.patch(
  "/update-profile",
  authMiddleware,
  upload.single("image"),
  updateProfile,
);
router.patch(
  "/change-password",
  authMiddleware,
  validate(changePasswordSchema),
  changePasswordController,
);

export default router;
