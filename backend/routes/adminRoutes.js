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
import { deleteUser } from "../controllers/userController.js";
import {
  getAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
} from "../controllers/couponController.js";
import { protect, authorize } from "../middleware/auth.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  adminIdParamValidator,
  adminRestaurantStatusValidator,
  createAdminUserValidator,
} from "../validators/adminValidators.js";

const router = express.Router();

// All admin routes require admin authorization
router.use(protect, authorize("admin"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Restaurants management
router.get("/restaurants", getAllRestaurants);
router.post("/restaurants", createRestaurant);
router.put(
  "/approve/:id",
  adminIdParamValidator,
  validateRequest,
  approveRestaurant,
);
router.put("/restaurants/:id/approve", approveRestaurant);
router.put(
  "/restaurants/:id/reject",
  adminIdParamValidator,
  adminRestaurantStatusValidator,
  validateRequest,
  rejectRestaurant,
);
router.put(
  "/restaurants/:id/suspend",
  adminIdParamValidator,
  adminRestaurantStatusValidator,
  validateRequest,
  suspendRestaurant,
);
router.put(
  "/restaurants/:id/unsuspend",
  adminIdParamValidator,
  validateRequest,
  unsuspendRestaurant,
);
router.delete(
  "/restaurants/:id",
  adminIdParamValidator,
  validateRequest,
  deleteRestaurant,
);
router.delete(
  "/restaurant/:id",
  adminIdParamValidator,
  validateRequest,
  deleteRestaurant,
);

// Users management
router.get("/users", getAllUsers);
router.post("/users", createAdminUserValidator, validateRequest, createUser);
router.put(
  "/users/:id/block",
  adminIdParamValidator,
  validateRequest,
  blockUser,
);
router.put(
  "/users/:id/unblock",
  adminIdParamValidator,
  validateRequest,
  unblockUser,
);
router.delete("/user/:id", adminIdParamValidator, validateRequest, deleteUser);
router.delete("/users/:id", adminIdParamValidator, validateRequest, deleteUser);

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
