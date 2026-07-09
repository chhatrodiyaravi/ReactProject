import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";
import { uploadProfilePic } from "../config/multer.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  changePasswordValidator,
  updateProfileValidator,
  userIdParamValidator,
} from "../validators/userValidators.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getUsers);
router.get("/profile", protect, getProfile);
router.put(
  "/profile",
  protect,
  uploadProfilePic.single("avatar"),
  updateProfileValidator,
  validateRequest,
  updateProfile,
);
router.put(
  "/change-password",
  protect,
  changePasswordValidator,
  validateRequest,
  changePassword,
);
router.get("/:id", protect, getUser);
router.put(
  "/:id",
  protect,
  userIdParamValidator,
  uploadProfilePic.single("avatar"),
  updateProfileValidator,
  validateRequest,
  updateUser,
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  userIdParamValidator,
  validateRequest,
  deleteUser,
);

export default router;
