import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Please provide an order ID"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user ID"],
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Please provide a restaurant ID"],
    },
    disputeType: {
      type: String,
      required: [true, "Please specify dispute type"],
      enum: [
        "late_delivery",
        "damaged_food",
        "wrong_order",
        "missing_items",
        "quality_issue",
        "payment_issue",
        "other",
      ],
    },
    title: {
      type: String,
      required: [true, "Please provide a dispute title"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a detailed description"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    evidence: [
      {
        type: String, // image URLs
      },
    ],
    refundAmount: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["open", "under_review", "resolved", "rejected", "closed"],
      default: "open",
    },
    resolution: {
      type: String,
      enum: ["full_refund", "partial_refund", "replacement", "no_action"],
    },
    adminNotes: {
      type: String,
      maxlength: [1000, "Admin notes cannot exceed 1000 characters"],
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: Date,
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Index for better query performance
disputeSchema.index({ order: 1 });
disputeSchema.index({ user: 1 });
disputeSchema.index({ status: 1 });
disputeSchema.index({ createdAt: -1 });
disputeSchema.index({ priority: 1, status: 1 });

// Set resolution details when status changes to resolved
disputeSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "resolved") {
    this.resolvedAt = new Date();
  }
  next();
});

// Get pending disputes
disputeSchema.statics.getPendingDisputes = function () {
  return this.find({
    status: { $in: ["open", "under_review"] },
  })
    .populate("order", "orderId totalPrice")
    .populate("user", "name email")
    .populate("restaurant", "name")
    .sort({ priority: -1, createdAt: -1 });
};

// Get disputes by user
disputeSchema.statics.getUserDisputes = function (userId) {
  return this.find({ user: userId })
    .populate("order", "orderId totalPrice orderStatus")
    .populate("restaurant", "name");
};

export default mongoose.model("Dispute", disputeSchema);
