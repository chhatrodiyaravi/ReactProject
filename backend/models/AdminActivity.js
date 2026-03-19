import mongoose from "mongoose";

const adminActivitySchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide an admin ID"],
    },
    actionType: {
      type: String,
      required: [true, "Please specify action type"],
      enum: [
        "create_restaurant",
        "approve_restaurant",
        "reject_restaurant",
        "suspend_restaurant",
        "unsuspend_restaurant",
        "delete_restaurant",
        "create_user",
        "block_user",
        "unblock_user",
        "delete_user",
        "delete_order",
        "update_order_status",
        "resolve_dispute",
        "create_category",
        "update_category",
        "delete_category",
        "create_coupon",
        "update_coupon",
        "delete_coupon",
        "generate_report",
        "system_config",
        "other",
      ],
    },
    entityType: {
      type: String,
      required: [true, "Please specify entity type"],
      enum: ["restaurant", "user", "order", "dispute", "category", "system"],
    },
    entityId: mongoose.Schema.Types.ObjectId,
    entityName: String,
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    changes: {
      type: Map,
      of: String,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "success",
    },
    reason: {
      type: String,
      maxlength: [500, "Reason cannot exceed 500 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false },
);

// Index for better query performance
adminActivitySchema.index({ admin: 1, createdAt: -1 });
adminActivitySchema.index({ actionType: 1 });
adminActivitySchema.index({ entityType: 1 });
adminActivitySchema.index({ createdAt: -1 });
adminActivitySchema.index({ status: 1 });

// Get activities by admin
adminActivitySchema.statics.getAdminActivities = function (
  adminId,
  limit = 100,
) {
  return this.find({ admin: adminId })
    .populate("admin", "name email")
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Get recent activities
adminActivitySchema.statics.getRecentActivities = function (limit = 50) {
  return this.find()
    .populate("admin", "name email role")
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Get activities by entity
adminActivitySchema.statics.getEntityActivities = function (
  entityType,
  entityId,
) {
  return this.find({ entityType, entityId })
    .populate("admin", "name email")
    .sort({ createdAt: -1 });
};

export default mongoose.model("AdminActivity", adminActivitySchema);
