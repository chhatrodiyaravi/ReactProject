import express from "express";
import {
  createReview,
  getFoodReviews,
  getRestaurantReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  markHelpful,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  createReviewValidator,
  foodReviewsParamValidator,
  restaurantReviewsParamValidator,
  reviewIdParamValidator,
  updateReviewValidator,
} from "../validators/reviewValidators.js";

const router = express.Router();

// Public routes
router.get(
  "/food/:foodId",
  foodReviewsParamValidator,
  validateRequest,
  getFoodReviews,
);
router.get(
  "/restaurant/:restaurantId",
  restaurantReviewsParamValidator,
  validateRequest,
  getRestaurantReviews,
);

// Private routes
router.post("/", protect, createReviewValidator, validateRequest, createReview);
router.get("/my", protect, getUserReviews);
router.put(
  "/:id",
  protect,
  reviewIdParamValidator,
  updateReviewValidator,
  validateRequest,
  updateReview,
);
router.delete(
  "/:id",
  protect,
  reviewIdParamValidator,
  validateRequest,
  deleteReview,
);
router.put(
  "/:id/helpful",
  protect,
  reviewIdParamValidator,
  validateRequest,
  markHelpful,
);

export default router;
