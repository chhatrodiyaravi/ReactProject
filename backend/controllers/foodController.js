import Food from "../models/Food.js";
import Restaurant from "../models/Restaurant.js";
import Category from "../models/Category.js";

// @desc    Get all foods
// @route   GET /api/foods
// @access  Public
export const getFoods = async (req, res) => {
  try {
    const { restaurant, category, isVegetarian, search } = req.query;

    let query = { isAvailable: true };

    // Filter by restaurant
    if (restaurant) {
      query.restaurant = restaurant;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by vegetarian
    if (isVegetarian) {
      query.isVegetarian = isVegetarian === "true";
    }

    // Search by text fields
    if (search) {
      const pattern = new RegExp(search, "i");
      query.$or = [
        { name: pattern },
        { description: pattern },
        { category: pattern },
        { ingredients: pattern },
      ];
    }

    const foods = await Food.find(query).populate("restaurant", "name image");

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single food
// @route   GET /api/foods/:id
// @access  Public
export const getFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate(
      "restaurant",
      "name image address phone",
    );

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new food item
// @route   POST /api/foods
// @access  Private/Owner
export const createFood = async (req, res) => {
  try {
    // Verify restaurant exists and belongs to user
    const restaurant = await Restaurant.findById(req.body.restaurant);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (
      restaurant.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to add food to this restaurant",
      });
    }

    // Add owner and image path
    req.body.owner = req.user.id;
    if (req.file) {
      req.body.image = `/uploads/products/${req.file.filename}`;
    }

    const food = await Food.create(req.body);

    res.status(201).json({
      success: true,
      data: food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update food item
// @route   PUT /api/foods/:id
// @access  Private/Owner
export const updateFood = async (req, res) => {
  try {
    let food = await Food.findById(req.params.id).populate("restaurant");

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    // Make sure user is restaurant owner
    if (
      food.restaurant.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this food item",
      });
    }

    // Add image path if uploaded
    if (req.file) {
      req.body.image = `/uploads/products/${req.file.filename}`;
    }

    food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete food item
// @route   DELETE /api/foods/:id
// @access  Private/Owner
export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate("restaurant");

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    // Make sure user is restaurant owner
    if (
      food.restaurant.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this food item",
      });
    }

    await Food.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Food item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all categories
// @route   GET /api/foods/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .select("name slug description image icon displayOrder")
      .sort({ displayOrder: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
