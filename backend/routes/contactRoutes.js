import express from "express";
import {
  createContact,
  getAllContacts,
  getContactById,
  replyToContact,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactController.js";
import { protect, authorize } from "../middleware/auth.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  contactIdParamValidator,
  contactStatusValidator,
  createContactValidator,
  replyContactValidator,
} from "../validators/contactValidators.js";

const router = express.Router();

// Public route
router.post("/", createContactValidator, validateRequest, createContact);

// Admin only routes
router.get("/", protect, authorize("admin"), getAllContacts);
router.get(
  "/:id",
  protect,
  authorize("admin"),
  contactIdParamValidator,
  validateRequest,
  getContactById,
);
router.put(
  "/:id/reply",
  protect,
  authorize("admin"),
  contactIdParamValidator,
  replyContactValidator,
  validateRequest,
  replyToContact,
);
router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  contactIdParamValidator,
  contactStatusValidator,
  validateRequest,
  updateContactStatus,
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  contactIdParamValidator,
  validateRequest,
  deleteContact,
);

export default router;
