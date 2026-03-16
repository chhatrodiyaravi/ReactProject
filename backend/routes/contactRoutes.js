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

const router = express.Router();

// Public route
router.post("/", createContact);

// Admin only routes
router.get("/", protect, authorize("admin"), getAllContacts);
router.get("/:id", protect, authorize("admin"), getContactById);
router.put("/:id/reply", protect, authorize("admin"), replyToContact);
router.put("/:id/status", protect, authorize("admin"), updateContactStatus);
router.delete("/:id", protect, authorize("admin"), deleteContact);

export default router;
