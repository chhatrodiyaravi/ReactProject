import Review from "../models/Review.js";
import Rating from "../models/Rating.js";

// @desc    Create a review for food
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { foodId, restaurantId, rating, title, comment } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!foodId || !restaurantId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if already reviewed this food
    const existingReview = await Review.findOne({
      user: userId,
      food: foodId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this food item",
      });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      food: foodId,
      restaurant: restaurantId,
      rating,
      title,
      comment,
      isVerifiedPurchase: true, // This should be checked against orders in production
    });

    // Populate user info
    await review.populate("user", "name email");

    console.log("Review created:", review._id);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create review",
    });
  }
};

// @desc    Get reviews for a food item
// @route   GET /api/reviews/food/:foodId
// @access  Public
export const getFoodReviews = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { page = 1, limit = 10, sortBy = "newest" } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Determine sort order
    let sort = { createdAt: -1 };
    if (sortBy === "helpful") {
      sort = { helpful: -1 };
    } else if (sortBy === "rating_high") {
      sort = { rating: -1 };
    } else if (sortBy === "rating_low") {
      sort = { rating: 1 };
    }

    const reviews = await Review.find({ food: foodId })
      .populate("user", "name email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ food: foodId });

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { food: { $oid: foodId } } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total,
        pages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
      },
      stats: ratingStats[0] || { averageRating: 0, totalReviews: 0 },
    });
  } catch (error) {
    console.error("Get food reviews error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch reviews",
    });
  }
};

// @desc    Get reviews for a restaurant
// @route   GET /api/reviews/restaurant/:restaurantId
// @access  Public
export const getRestaurantReviews = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { page = 1, limit = 10, sortBy = "newest" } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let sort = { createdAt: -1 };
    if (sortBy === "helpful") {
      sort = { helpful: -1 };
    } else if (sortBy === "rating_high") {
      sort = { rating: -1 };
    } else if (sortBy === "rating_low") {
      sort = { rating: 1 };
    }

    const reviews = await Review.find({ restaurant: restaurantId })
      .populate("user", "name email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ restaurant: restaurantId });

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total,
        pages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.error("Get restaurant reviews error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch reviews",
    });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/my
// @access  Private
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ user: userId })
      .populate("food", "name image")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total,
        pages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.error("Get user reviews error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch your reviews",
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check authorization
    if (review.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review",
      });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;

    await review.save();
    await review.populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update review",
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check authorization
    if (review.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    await Review.findByIdAndDelete(id);

    console.log("Review deleted:", id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete review",
    });
  }
};

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
export const markHelpful = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpful: 1 } },
      { new: true },
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review marked as helpful",
      data: review,
    });
  } catch (error) {
    console.error("Mark helpful error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to mark review",
    });
  }
};
