import Wishlist from "../models/Wishlist.js";
import Food from "../models/Food.js";

export const addToWishlist = async (req, res) => {
  try {
    const { foodId } = req.body;

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    const existing = await Wishlist.findOne({
      user: req.user.id,
      food: foodId,
    });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Food already exists in wishlist",
        data: existing,
      });
    }

    const wishlistItem = await Wishlist.create({
      user: req.user.id,
      food: foodId,
    });

    res.status(201).json({
      success: true,
      message: "Food added to wishlist",
      data: wishlistItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.id })
      .populate(
        "food",
        "name price image category isAvailable rating restaurant",
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const removed = await Wishlist.findOneAndDelete({
      user: req.user.id,
      food: req.params.id,
    });

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist item removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
