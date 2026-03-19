import mongoose from "mongoose";

const ownerActivitySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide an owner ID"],
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Please provide a restaurant ID"],
    },
    activityType: {
      type: String,
      required: [true, "Please specify activity type"],
      enum: [
        "add_food",
        "edit_food",
        "delete_food",
        "upload_image",
        "accept_order",
        "reject_order",
        "update_order_status",
        "update_restaurant_info",
        "update_hours",
        "update_delivery_time",
        "view_analytics",
        "view_orders",
        "respond_review",
        "update_menu",
        "create_coupon",
        "update_coupon",
        "delete_coupon",
        "other",
      ],
    },
    entityType: {
      type: String,
      enum: ["food", "order", "restaurant", "menu", "image", "coupon"],
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
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "success",
    },
    result: String,
    details: {
      itemBefore: mongoose.Schema.Types.Mixed,
      itemAfter: mongoose.Schema.Types.Mixed,
    },
    ipAddress: String,
    userAgent: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false },
);

// Index for better query performance
ownerActivitySchema.index({ restaurant: 1, createdAt: -1 });
ownerActivitySchema.index({ owner: 1, createdAt: -1 });
ownerActivitySchema.index({ activityType: 1 });
ownerActivitySchema.index({ entityType: 1 });
ownerActivitySchema.index({ createdAt: -1 });

// Get activities by restaurant
ownerActivitySchema.statics.getRestaurantActivities = function (
  restaurantId,
  limit = 100,
) {
  return this.find({ restaurant: restaurantId })
    .populate("owner", "name email")
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Get activities by owner
ownerActivitySchema.statics.getOwnerActivities = function (
  ownerId,
  limit = 100,
) {
  return this.find({ owner: ownerId })
    .populate("restaurant", "name")
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Get recent menu changes
ownerActivitySchema.statics.getRecentMenuChanges = function (
  restaurantId,
  limit = 20,
) {
  return this.find({
    restaurant: restaurantId,
    activityType: { $in: ["add_food", "edit_food", "delete_food"] },
  })
    .populate("entityId")
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Get order activities
ownerActivitySchema.statics.getOrderActivities = function (restaurantId) {
  return this.find({
    restaurant: restaurantId,
    activityType: {
      $in: ["accept_order", "reject_order", "update_order_status"],
    },
  })
    .populate("owner", "name")
    .sort({ createdAt: -1 });
};

export default mongoose.model("OwnerActivity", ownerActivitySchema);
