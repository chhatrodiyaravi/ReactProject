import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user ID"],
    },
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: [true, "Please provide a food ID"],
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Please provide a restaurant ID"],
    },
    rating: {
      type: Number,
      required: [true, "Please provide a rating"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
      default: "",
    },
    comment: {
      type: String,
      required: [true, "Please provide a review comment"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    helpful: {
      type: Number,
      default: 0,
      min: 0,
    },
    unhelpful: {
      type: Number,
      default: 0,
      min: 0,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        type: String,
      },
    ],
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
reviewSchema.index({ food: 1, rating: 1 });
reviewSchema.index({ restaurant: 1, rating: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ createdAt: -1 });

// Calculate average rating method
reviewSchema.statics.getAverageRating = async function (foodId) {
  const obj = await this.aggregate([
    {
      $match: { food: foodId },
    },
    {
      $group: {
        _id: "$food",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    if (obj.length > 0) {
      await mongoose.model("Food").findByIdAndUpdate(foodId, {
        rating: obj[0].averageRating,
        totalReviews: obj[0].totalReviews,
      });
    } else {
      await mongoose.model("Food").findByIdAndUpdate(foodId, {
        rating: 0,
        totalReviews: 0,
      });
    }
  } catch (error) {
    console.error("Error updating food rating:", error);
  }
};

// Call getAverageRating after save
reviewSchema.post("save", async function () {
  await this.constructor.getAverageRating(this.food);
});

// Call getAverageRating before remove
reviewSchema.pre("findByIdAndDelete", async function () {
  const review = await this.model.findOne(this.getFilter());
  if (review) {
    await review.constructor.getAverageRating(review.food);
  }
});

export default mongoose.model("Review", reviewSchema);
