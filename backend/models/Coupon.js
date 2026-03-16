import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please provide a coupon code"],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, "Code must be at least 3 characters"],
      maxlength: [20, "Code cannot exceed 20 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    discountType: {
      type: String,
      required: [true, "Please specify discount type"],
      enum: ["percentage", "fixed"],
    },
    discountValue: {
      type: Number,
      required: [true, "Please provide a discount value"],
      min: [0, "Discount value cannot be negative"],
    },
    maxDiscount: {
      type: Number,
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    usageLimit: {
      type: Number,
      min: 0,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    userUsageLimit: {
      type: Number,
      default: 1,
      min: 1,
    },
    applicableRestaurants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
      },
    ],
    applicableCategories: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      required: [true, "Please provide a start date"],
    },
    expirationDate: {
      type: Date,
      required: [true, "Please provide an expiration date"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
couponSchema.index({ code: 1 });
couponSchema.index({ expirationDate: 1 });
couponSchema.index({ isActive: 1 });

// Validate expiration date
couponSchema.pre("save", function (next) {
  if (this.expirationDate <= new Date()) {
    this.isActive = false;
  }
  next();
});

// Check if coupon is valid
couponSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.startDate &&
    now <= this.expirationDate &&
    (!this.usageLimit || this.usedCount < this.usageLimit)
  );
};

// Check if coupon has reached usage limit
couponSchema.methods.canUse = function () {
  if (!this.isValid()) {
    return false;
  }
  return !this.usageLimit || this.usedCount < this.usageLimit;
};

// Calculate discount amount
couponSchema.methods.calculateDiscount = function (orderAmount) {
  if (!this.canUse() || orderAmount < this.minOrderAmount) {
    return 0;
  }

  let discount = 0;
  if (this.discountType === "percentage") {
    discount = (orderAmount * this.discountValue) / 100;
    if (this.maxDiscount) {
      discount = Math.min(discount, this.maxDiscount);
    }
  } else {
    discount = this.discountValue;
  }

  return Math.min(discount, orderAmount);
};

export default mongoose.model("Coupon", couponSchema);
