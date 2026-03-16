import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user ID"],
    },
    ratingType: {
      type: String,
      required: [true, "Please specify rating type"],
      enum: ["food", "restaurant", "delivery"],
    },
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    rating: {
      type: Number,
      required: [true, "Please provide a rating"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    feedback: {
      type: String,
      maxlength: [500, "Feedback cannot exceed 500 characters"],
    },
    tags: [
      {
        type: String,
      },
    ],
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
      min: 0,
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

// Ensure either food or restaurant is provided
ratingSchema.pre("save", function (next) {
  if (this.ratingType === "food" && !this.food) {
    throw new Error("Food rating must include a food reference");
  }
  if (this.ratingType === "restaurant" && !this.restaurant) {
    throw new Error("Restaurant rating must include a restaurant reference");
  }
  if (this.ratingType === "delivery" && !this.order) {
    throw new Error("Delivery rating must include an order reference");
  }
  next();
});

// Index for better query performance
ratingSchema.index({ food: 1, rating: 1 });
ratingSchema.index({ restaurant: 1, rating: 1 });
ratingSchema.index({ user: 1 });
ratingSchema.index({ createdAt: -1 });
ratingSchema.index({ ratingType: 1 });

// Calculate average rating for food
ratingSchema.statics.getAverageFoodRating = async function (foodId) {
  const result = await this.aggregate([
    {
      $match: {
        food: new mongoose.Types.ObjectId(foodId),
        ratingType: "food",
      },
    },
    {
      $group: {
        _id: "$food",
        averageRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await mongoose.model("Food").findByIdAndUpdate(foodId, {
      rating: Math.round(result[0].averageRating * 10) / 10,
      totalReviews: result[0].totalRatings,
    });
  }

  return result[0] || null;
};

// Calculate average rating for restaurant
ratingSchema.statics.getAverageRestaurantRating = async function (
  restaurantId,
) {
  const result = await this.aggregate([
    {
      $match: {
        restaurant: new mongoose.Types.ObjectId(restaurantId),
        ratingType: "restaurant",
      },
    },
    {
      $group: {
        _id: "$restaurant",
        averageRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await mongoose.model("Restaurant").findByIdAndUpdate(restaurantId, {
      rating: Math.round(result[0].averageRating * 10) / 10,
      totalReviews: result[0].totalRatings,
    });
  }

  return result[0] || null;
};

// Update rating when saved
ratingSchema.post("save", async function () {
  if (this.ratingType === "food" && this.food) {
    await this.constructor.getAverageFoodRating(this.food);
  } else if (this.ratingType === "restaurant" && this.restaurant) {
    await this.constructor.getAverageRestaurantRating(this.restaurant);
  }
});

export default mongoose.model("Rating", ratingSchema);
