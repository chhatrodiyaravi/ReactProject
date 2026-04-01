import express from "express";
import {
  getDashboardStats,
  getAllRestaurants,
  createRestaurant,
  approveRestaurant,
  rejectRestaurant,
  deleteRestaurant,
  suspendRestaurant,
  unsuspendRestaurant,
  getAllUsers,
  createUser,
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
import {
  getAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
} from "../controllers/couponController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require admin authorization
router.use(protect, authorize("admin"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Restaurants management
router.get("/restaurants", getAllRestaurants);
router.post("/restaurants", createRestaurant);
router.put("/restaurants/:id/approve", approveRestaurant);
router.put("/restaurants/:id/reject", rejectRestaurant);
router.put("/restaurants/:id/suspend", suspendRestaurant);
router.put("/restaurants/:id/unsuspend", unsuspendRestaurant);
router.delete("/restaurants/:id", deleteRestaurant);

// Users management
router.get("/users", getAllUsers);
router.post("/users", createUser);
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

// Discount/Coupon management
router.get("/coupons", getAdminCoupons);
router.post("/coupons", createAdminCoupon);
router.put("/coupons/:id", updateAdminCoupon);
router.delete("/coupons/:id", deleteAdminCoupon);

export default router;
