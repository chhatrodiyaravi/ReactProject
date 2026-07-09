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
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  createRestaurantValidator,
  restaurantIdParamValidator,
  updateRestaurantValidator,
} from "../validators/restaurantValidators.js";

const router = express.Router();

router.get("/", getRestaurants);
router.get("/:id", restaurantIdParamValidator, validateRequest, getRestaurant);
router.post(
  "/",
  protect,
  authorize("owner", "admin"),
  upload.single("image"),
  createRestaurantValidator,
  validateRequest,
  createRestaurant,
);
router.put(
  "/:id",
  protect,
  authorize("owner", "admin"),
  upload.single("image"),
  restaurantIdParamValidator,
  updateRestaurantValidator,
  validateRequest,
  updateRestaurant,
);
router.delete(
  "/:id",
  protect,
  authorize("owner", "admin"),
  restaurantIdParamValidator,
  validateRequest,
  deleteRestaurant,
);

export default router;
