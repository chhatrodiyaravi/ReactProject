import express from "express";
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
} from "../validators/authValidators.js";

const router = express.Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validateRequest,
  forgotPassword,
);
router.post(
  "/reset-password/:token",
  resetPasswordValidator,
  validateRequest,
  resetPassword,
);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
