import express from "express";
import {
  getOwnerRestaurant,
  getOwnerMenu,
  addFoodItem,
  editFoodItem,
  deleteFoodItem,
  getOwnerOrders,
  acceptOrder,
  rejectOrder,
  updateOrderStatus,
  updateRestaurantInfo,
  getOwnerAnalytics,
  getOwnerActivityLogs,
} from "../controllers/ownerController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../config/multer.js";

const router = express.Router();

// All owner routes require owner authorization
router.use(protect, authorize("owner"));

// Restaurant info
router.get("/restaurant", getOwnerRestaurant);
router.put("/restaurant", updateRestaurantInfo);

// Menu management
router.get("/menu", getOwnerMenu);
router.post("/menu", upload.single("image"), addFoodItem);
router.put("/menu/:id", upload.single("image"), editFoodItem);
router.delete("/menu/:id", deleteFoodItem);

// Order management
router.get("/orders", getOwnerOrders);
router.put("/orders/:id/accept", acceptOrder);
router.put("/orders/:id/reject", rejectOrder);
router.put("/orders/:id/status", updateOrderStatus);

// Analytics
router.get("/analytics", getOwnerAnalytics);

// Activity logs
router.get("/activities", getOwnerActivityLogs);

export default router;
