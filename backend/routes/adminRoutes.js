import express from "express";
import {
  getDashboardStats,
  getAllRestaurants,
  approveRestaurant,
  rejectRestaurant,
  suspendRestaurant,
  unsuspendRestaurant,
  getAllUsers,
  blockUser,
  unblockUser,
  getPendingDisputes,
  resolveDispute,
  getAllOrders,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getActivityLogs,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require admin authorization
router.use(protect, authorize("admin"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Restaurants management
router.get("/restaurants", getAllRestaurants);
router.put("/restaurants/:id/approve", approveRestaurant);
router.put("/restaurants/:id/reject", rejectRestaurant);
router.put("/restaurants/:id/suspend", suspendRestaurant);
router.put("/restaurants/:id/unsuspend", unsuspendRestaurant);

// Users management
router.get("/users", getAllUsers);
router.put("/users/:id/block", blockUser);
router.put("/users/:id/unblock", unblockUser);

// Orders management
router.get("/orders", getAllOrders);

// Dispute management
router.get("/disputes", getPendingDisputes);
router.put("/disputes/:id/resolve", resolveDispute);

// Categories management
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Activity logs
router.get("/activities", getActivityLogs);

export default router;
