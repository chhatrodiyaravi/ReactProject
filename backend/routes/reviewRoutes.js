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

const router = express.Router();

// Public routes
router.get("/food/:foodId", getFoodReviews);
router.get("/restaurant/:restaurantId", getRestaurantReviews);

// Private routes
router.post("/", protect, createReview);
router.get("/my", protect, getUserReviews);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);
router.put("/:id/helpful", protect, markHelpful);

export default router;
