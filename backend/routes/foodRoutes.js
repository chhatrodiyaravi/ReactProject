import express from "express";
import {
  getFoods,
  getFood,
  createFood,
  updateFood,
  deleteFood,
  getCategories,
} from "../controllers/foodController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../config/multer.js";

const router = express.Router();

// Public routes
router.get("/categories", getCategories);
router.get("/", getFoods);
router.get("/:id", getFood);
router.post(
  "/",
  protect,
  authorize("owner", "admin"),
  upload.single("image"),
  createFood,
);
router.put(
  "/:id",
  protect,
  authorize("owner", "admin"),
  upload.single("image"),
  updateFood,
);
router.delete("/:id", protect, authorize("owner", "admin"), deleteFood);

export default router;
