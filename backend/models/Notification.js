import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user ID"],
    },
    type: {
      type: String,
      required: [true, "Please provide a notification type"],
      enum: [
        "order_placed",
        "order_confirmed",
        "order_preparing",
        "order_shipped",
        "order_delivered",
        "order_cancelled",
        "payment_success",
        "payment_failed",
        "promotion",
        "new_restaurant",
        "food_available",
        "food_unavailable",
        "review_response",
        "account_update",
        "password_reset",
        "general",
      ],
    },
    title: {
      type: String,
      required: [true, "Please provide a notification title"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Please provide a notification message"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    relatedEntity: {
      entityType: {
        type: String,
        enum: ["order", "food", "restaurant", "coupon", "user", "review"],
      },
      entityId: mongoose.Schema.Types.ObjectId,
    },
    actionUrl: {
      type: String,
      default: "",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    expiresAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Index for better query performance
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expiresAt: 1 }, { sparse: true });

// Mark notification as read
notificationSchema.methods.markAsRead = async function () {
  this.isRead = true;
  this.readAt = new Date();
  return await this.save();
};

// Mark notification as unread
notificationSchema.methods.markAsUnread = async function () {
  this.isRead = false;
  this.readAt = null;
  return await this.save();
};

// Static method to mark multiple notifications as read
notificationSchema.statics.markMultipleAsRead = async function (
  notificationIds,
) {
  return await this.updateMany(
    { _id: { $in: notificationIds } },
    { isRead: true, readAt: new Date() },
  );
};

// Static method to get unread count for a user
notificationSchema.statics.getUnreadCount = async function (userId) {
  return await this.countDocuments({
    user: userId,
    isRead: false,
  });
};

// Auto-delete expired notifications (TTL index would be better in production)
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Notification", notificationSchema);
