import express from "express";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/auth.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  addWishlistValidator,
  wishlistIdParamValidator,
} from "../validators/wishlistValidators.js";

const router = express.Router();

router.get("/", protect, getWishlist);
router.post(
  "/add",
  protect,
  addWishlistValidator,
  validateRequest,
  addToWishlist,
);
router.delete(
  "/remove/:id",
  protect,
  wishlistIdParamValidator,
  validateRequest,
  removeFromWishlist,
);

export default router;
