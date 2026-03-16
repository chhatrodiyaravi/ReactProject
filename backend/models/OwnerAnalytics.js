import mongoose from "mongoose";

const ownerAnalyticsSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Please provide a restaurant ID"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide an owner ID"],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    acceptedOrders: {
      type: Number,
      default: 0,
    },
    rejectedOrders: {
      type: Number,
      default: 0,
    },
    cancelledOrders: {
      type: Number,
      default: 0,
    },
    deliveredOrders: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    totalItemsSold: {
      type: Number,
      default: 0,
    },
    averageOrderValue: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    orderAcceptanceRate: {
      type: Number,
      default: 0,
    },
    orderCompletionRate: {
      type: Number,
      default: 0,
    },
    topSellingFoods: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
        },
        name: String,
        quantity: Number,
        revenue: Number,
      },
    ],
    peakHours: [
      {
        hour: Number,
        orders: Number,
      },
    ],
    newCustomers: {
      type: Number,
      default: 0,
    },
    returningCustomers: {
      type: Number,
      default: 0,
    },
    activeMenuItems: {
      type: Number,
      default: 0,
    },
    totalMenuItems: {
      type: Number,
      default: 0,
    },
    averageDeliveryTime: {
      type: Number, // in minutes
      default: 0,
    },
    pendingOrders: {
      type: Number,
      default: 0,
    },
    disputes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Index for better query performance
ownerAnalyticsSchema.index({ restaurant: 1, date: -1 });
ownerAnalyticsSchema.index({ owner: 1, date: -1 });
ownerAnalyticsSchema.index({ date: -1 });

// Get analytics for date range
ownerAnalyticsSchema.statics.getAnalyticsByDateRange = function (
  restaurantId,
  startDate,
  endDate,
) {
  return this.find({
    restaurant: restaurantId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: -1 });
};

// Get today's analytics
ownerAnalyticsSchema.statics.getTodayAnalytics = function (restaurantId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return this.findOne({
    restaurant: restaurantId,
    date: {
      $gte: today,
      $lt: tomorrow,
    },
  });
};

// Get cumulative analytics
ownerAnalyticsSchema.statics.getCumulativeAnalytics = function (restaurantId) {
  return this.aggregate([
    {
      $match: {
        restaurant: new mongoose.Types.ObjectId(restaurantId),
      },
    },
    {
      $group: {
        _id: "$restaurant",
        totalOrders: { $sum: "$totalOrders" },
        totalRevenue: { $sum: "$totalRevenue" },
        totalItemsSold: { $sum: "$totalItemsSold" },
        averageOrderValue: { $avg: "$averageOrderValue" },
        averageRating: { $avg: "$averageRating" },
      },
    },
  ]);
};

// Get week analytics
ownerAnalyticsSchema.statics.getWeekAnalytics = function (restaurantId) {
  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  return this.find({
    restaurant: restaurantId,
    date: {
      $gte: lastWeek,
      $lte: today,
    },
  }).sort({ date: -1 });
};

export default mongoose.model("OwnerAnalytics", ownerAnalyticsSchema);
