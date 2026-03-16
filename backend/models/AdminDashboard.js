import mongoose from "mongoose";

const adminDashboardSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    totalRestaurants: {
      type: Number,
      default: 0,
    },
    activeRestaurants: {
      type: Number,
      default: 0,
    },
    suspendedRestaurants: {
      type: Number,
      default: 0,
    },
    totalUsers: {
      type: Number,
      default: 0,
    },
    activeUsers: {
      type: Number,
      default: 0,
    },
    blockedUsers: {
      type: Number,
      default: 0,
    },
    newOrdersToday: {
      type: Number,
      default: 0,
    },
    deliveredOrdersToday: {
      type: Number,
      default: 0,
    },
    cancelledOrdersToday: {
      type: Number,
      default: 0,
    },
    revenueToday: {
      type: Number,
      default: 0,
    },
    topRestaurants: [
      {
        restaurant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Restaurant",
        },
        orders: Number,
        revenue: Number,
      },
    ],
    topFoods: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
        },
        orders: Number,
        revenue: Number,
      },
    ],
    pendingDisputes: {
      type: Number,
      default: 0,
    },
    pendingApprovals: {
      type: Number,
      default: 0,
    },
    averageOrderValue: {
      type: Number,
      default: 0,
    },
    orderCompletionRate: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Index for better query performance
adminDashboardSchema.index({ date: -1 });

// Get stats for date range
adminDashboardSchema.statics.getStatsByDateRange = function (
  startDate,
  endDate,
) {
  return this.find({
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: -1 });
};

// Get today's stats
adminDashboardSchema.statics.getTodayStats = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return this.findOne({
    date: {
      $gte: today,
      $lt: tomorrow,
    },
  });
};

export default mongoose.model("AdminDashboard", adminDashboardSchema);
