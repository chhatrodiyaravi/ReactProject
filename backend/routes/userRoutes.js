import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";
import { uploadProfilePic } from "../config/multer.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getUsers);
router.get("/:id", protect, getUser);
router.put("/:id", protect, uploadProfilePic.single("avatar"), updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;
