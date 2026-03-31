import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [
    {
      food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true,
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
      },
      itemTotal: {
        type: Number,
        default: 0,
      },
    },
  ],
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  paymentMethod: {
    type: String,
    required: [true, "Please provide a payment method"],
    enum: ["Cash on Delivery", "Credit Card", "Debit Card", "UPI", "Wallet"],
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  deliveryPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  orderStatus: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ],
    default: "Pending",
  },
  deliveredAt: Date,
  couponApplied: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  hasDispute: {
    type: Boolean,
    default: false,
  },
  dispute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dispute",
  },
  adminNotes: String,
  cancelledBy: {
    type: String,
    enum: ["user", "restaurant", "admin"],
  },
  cancellationReason: String,
  cancelledAt: Date,
  acceptedAt: Date,
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rejectedAt: Date,
  rejectionReason: String,
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ownerNotes: String,
  estimatedDeliveryTime: Number, // in minutes
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for admin queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ hasDispute: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "orderItems.restaurant": 1 });

// Get orders by restaurant
orderSchema.statics.getRestaurantOrders = function (restaurantId) {
  return this.find({
    "orderItems.restaurant": restaurantId,
  }).populate("user", "name email phone");
};

// Get orders with disputes
orderSchema.statics.getDisputedOrders = function () {
  return this.find({ hasDispute: true })
    .populate("user", "name email")
    .populate("dispute")
    .sort({ createdAt: -1 });
};

// Mark order as cancelled
orderSchema.methods.cancel = async function (reason, cancelledBy = "user") {
  this.orderStatus = "Cancelled";
  this.cancelledAt = new Date();
  this.cancelledBy = cancelledBy;
  this.cancellationReason = reason;
  return await this.save();
};

// Accept order (owner)
orderSchema.methods.acceptOrder = async function (ownerId, estimatedTime) {
  this.orderStatus = "Confirmed";
  this.acceptedAt = new Date();
  this.acceptedBy = ownerId;
  this.estimatedDeliveryTime = estimatedTime;
  return await this.save();
};

// Reject order (owner)
orderSchema.methods.rejectOrder = async function (ownerId, reason) {
  this.orderStatus = "Cancelled";
  this.rejectedAt = new Date();
  this.rejectedBy = ownerId;
  this.rejectionReason = reason;
  return await this.save();
};

// Update order status (owner)
orderSchema.methods.updateStatus = async function (newStatus, notes = "") {
  this.orderStatus = newStatus;
  if (notes) {
    this.ownerNotes = notes;
  }
  if (newStatus === "Delivered") {
    this.deliveredAt = new Date();
  }
  return await this.save();
};

// Get pending orders for restaurant
orderSchema.statics.getPendingOrders = function (restaurantId) {
  return this.find({
    "orderItems.restaurant": restaurantId,
    orderStatus: "Pending",
  })
    .populate("user", "name email phone")
    .sort({ createdAt: 1 });
};

// Get recent orders for owner
orderSchema.statics.getRecentOrdersByRestaurant = function (
  restaurantId,
  limit = 10,
) {
  return this.find({
    "orderItems.restaurant": restaurantId,
  })
    .populate("user", "name email phone")
    .sort({ createdAt: -1 })
    .limit(limit);
};

export default mongoose.model("Order", orderSchema);
