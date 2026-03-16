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

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, authorize("admin", "owner"), getOrders);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put(
  "/:id/status",
  protect,
  authorize("admin", "owner"),
  updateOrderStatus,
);
router.put("/:id/payment", protect, updateOrderPayment);

export default router;
