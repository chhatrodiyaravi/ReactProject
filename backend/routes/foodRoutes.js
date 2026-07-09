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
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  createFoodValidator,
  foodIdParamValidator,
  updateFoodValidator,
} from "../validators/foodValidators.js";

const router = express.Router();

// Public routes
router.get("/categories", getCategories);
router.get("/", getFoods);
router.get("/:id", foodIdParamValidator, validateRequest, getFood);
router.post(
  "/",
  protect,
  authorize("owner", "admin"),
  upload.single("image"),
  createFoodValidator,
  validateRequest,
  createFood,
);
router.put(
  "/:id",
  protect,
  authorize("owner", "admin"),
  upload.single("image"),
  foodIdParamValidator,
  updateFoodValidator,
  validateRequest,
  updateFood,
);
router.delete(
  "/:id",
  protect,
  authorize("owner", "admin"),
  foodIdParamValidator,
  validateRequest,
  deleteFood,
);

export default router;
