import Restaurant from "../models/Restaurant.js";

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
export const getRestaurants = async (req, res) => {
  try {
    const { owner, includeInactive, search } = req.query;

    const query = {};
    if (owner) {
      query.owner = owner;
    }

    const shouldIncludeInactive =
      String(includeInactive).toLowerCase() === "true";
    const isOwnerScoped = Boolean(owner);

    // User/public side should only see restaurants approved by admin.
    if (!isOwnerScoped) {
      query.approvalStatus = "approved";
      query.isSuspended = false;
      query.isActive = true;
    } else if (!shouldIncludeInactive) {
      query.isActive = true;
    }

    if (search) {
      const pattern = new RegExp(search, "i");
      query.$or = [
        { name: pattern },
        { description: pattern },
        { cuisine: pattern },
        { "address.city": pattern },
      ];
    }

    const restaurants = await Restaurant.find(query).populate(
      "owner",
      "name email",
    );

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "owner",
      "name email",
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (
      restaurant.approvalStatus !== "approved" ||
      !restaurant.isActive ||
      restaurant.isSuspended
    ) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not available",
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new restaurant
// @route   POST /api/restaurants
// @access  Private/Owner
export const createRestaurant = async (req, res) => {
  try {
    // Add owner to req.body
    req.body.owner = req.user.id;

    // Add image path if uploaded
    if (req.file) {
      req.body.image = `/uploads/products/${req.file.filename}`;
    }

    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Owner
export const updateRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Make sure user is restaurant owner
    if (
      restaurant.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this restaurant",
      });
    }

    // Add image path if uploaded
    if (req.file) {
      req.body.image = `/uploads/products/${req.file.filename}`;
    }

    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Owner
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Make sure user is restaurant owner
    if (
      restaurant.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this restaurant",
      });
    }

    await Restaurant.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
