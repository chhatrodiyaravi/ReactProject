import express from "express";
import {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderPayment,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/auth.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  createOrderValidator,
  orderIdParamValidator,
  updateOrderStatusValidator,
} from "../validators/orderValidators.js";

const router = express.Router();

router.post("/", protect, createOrderValidator, validateRequest, createOrder);
router.get("/", protect, authorize("admin", "owner"), getOrders);
router.get("/myorders", protect, getMyOrders);
router.get(
  "/:id",
  protect,
  orderIdParamValidator,
  validateRequest,
  getOrderById,
);
router.put(
  "/:id/status",
  protect,
  authorize("admin", "owner"),
  orderIdParamValidator,
  updateOrderStatusValidator,
  validateRequest,
  updateOrderStatus,
);
router.put(
  "/:id/payment",
  protect,
  orderIdParamValidator,
  validateRequest,
  updateOrderPayment,
);

export default router;
