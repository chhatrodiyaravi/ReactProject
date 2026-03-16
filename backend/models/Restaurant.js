import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a restaurant name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
  },
  cuisine: [
    {
      type: String,
    },
  ],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },
  deliveryTime: {
    min: {
      type: Number,
      default: 20, // in minutes
    },
    max: {
      type: Number,
      default: 45, // in minutes
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  suspensionReason: {
    type: String,
    trim: true,
  },
  suspendedAt: Date,
  approvedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
  licenseNumber: String,
  certifications: [String],
  documents: [String],
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
restaurantSchema.index({ approvalStatus: 1 });
restaurantSchema.index({ isSuspended: 1 });
restaurantSchema.index({ owner: 1 });
restaurantSchema.index({ createdAt: -1 });
restaurantSchema.index({
  name: "text",
  description: "text",
  cuisine: "text",
  "address.city": "text",
});

// Approve restaurant
restaurantSchema.methods.approve = async function (adminId) {
  this.approvalStatus = "approved";
  this.approvedBy = adminId;
  this.approvedAt = new Date();
  return await this.save();
};

// Suspend restaurant
restaurantSchema.methods.suspend = async function (reason) {
  this.isSuspended = true;
  this.suspensionReason = reason;
  this.suspendedAt = new Date();
  this.isActive = false;
  return await this.save();
};

// Unsuspend restaurant
restaurantSchema.methods.unsuspend = async function () {
  this.isSuspended = false;
  this.suspensionReason = null;
  this.suspendedAt = null;
  this.isActive = true;
  return await this.save();
};

// Update delivery time
restaurantSchema.methods.updateDeliveryTime = async function (
  minTime,
  maxTime,
) {
  this.deliveryTime = {
    min: minTime,
    max: maxTime,
  };
  return await this.save();
};

// Get owner restaurants
restaurantSchema.statics.getOwnerRestaurants = function (ownerId) {
  return this.find({ owner: ownerId }).sort({ createdAt: -1 });
};

export default mongoose.model("Restaurant", restaurantSchema);
