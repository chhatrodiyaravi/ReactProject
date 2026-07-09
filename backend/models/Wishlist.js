import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
  },
  { timestamps: true },
);

wishlistSchema.index({ user: 1, food: 1 }, { unique: true });

export default mongoose.model("Wishlist", wishlistSchema);
