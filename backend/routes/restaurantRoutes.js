import express from "express";
import {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurantController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/", getRestaurants);
router.get("/:id", getRestaurant);
router.post(
  "/",
  protect,
  authorize("owner", "admin"),
  upload.single("image"),
  createRestaurant,
);
router.put(
  "/:id",
  protect,
  authorize("owner", "admin"),
  upload.single("image"),
  updateRestaurant,
);
router.delete("/:id", protect, authorize("owner", "admin"), deleteRestaurant);

export default router;
