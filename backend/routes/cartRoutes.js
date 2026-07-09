import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  addToCartValidator,
  cartItemParamValidator,
  updateCartItemValidator,
} from "../validators/cartValidators.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCartValidator, validateRequest, addToCart);
router.put(
  "/:itemId",
  protect,
  cartItemParamValidator,
  updateCartItemValidator,
  validateRequest,
  updateCartItem,
);
router.delete(
  "/:itemId",
  protect,
  cartItemParamValidator,
  validateRequest,
  removeFromCart,
);
router.delete("/", protect, clearCart);

export default router;
