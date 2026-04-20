import Restaurant from "../models/Restaurant.js";

const parseJsonSafely = (value, fallback) => {
  if (typeof value !== "string") {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const normalizeRestaurantPayload = (body = {}) => {
  const payload = { ...body };

  // Handle multipart keys like address[city]
  const addressFromBracketKeys = Object.entries(body)
    .filter(([key]) => key.startsWith("address[") && key.endsWith("]"))
    .reduce((acc, [key, value]) => {
      const nestedKey = key.slice(8, -1);
      acc[nestedKey] = typeof value === "string" ? value.trim() : value;
      return acc;
    }, {});

  if (Object.keys(addressFromBracketKeys).length > 0) {
    payload.address = addressFromBracketKeys;
  } else if (typeof body.address === "string") {
    payload.address = parseJsonSafely(body.address, {});
  } else if (!body.address || typeof body.address !== "object") {
    payload.address = {};
  }

  // Handle multipart keys like cuisine[0]
  const cuisineFromBracketKeys = Object.entries(body)
    .filter(([key]) => key.startsWith("cuisine[") && key.endsWith("]"))
    .sort((a, b) => {
      const aIndex = Number.parseInt(a[0].slice(8, -1), 10);
      const bIndex = Number.parseInt(b[0].slice(8, -1), 10);
      return aIndex - bIndex;
    })
    .map(([, value]) => value)
    .filter(Boolean);

  if (cuisineFromBracketKeys.length > 0) {
    payload.cuisine = cuisineFromBracketKeys;
  } else if (Array.isArray(body.cuisine)) {
    payload.cuisine = body.cuisine.filter(Boolean);
  } else if (typeof body.cuisine === "string") {
    const parsedCuisine = parseJsonSafely(body.cuisine, null);
    payload.cuisine = Array.isArray(parsedCuisine)
      ? parsedCuisine.filter(Boolean)
      : body.cuisine
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
  } else {
    payload.cuisine = [];
  }

  if (typeof payload.name === "string") {
    payload.name = payload.name.trim();
  }
  if (typeof payload.description === "string") {
    payload.description = payload.description.trim();
  }
  if (typeof payload.phone === "string") {
    payload.phone = payload.phone.trim();
  }
  if (typeof payload.email === "string") {
    payload.email = payload.email.trim();
  }

  // Cleanup multipart helper keys so they are not passed to Mongo.
  Object.keys(payload).forEach((key) => {
    if (
      (key.startsWith("address[") && key.endsWith("]")) ||
      (key.startsWith("cuisine[") && key.endsWith("]"))
    ) {
      delete payload[key];
    }
  });

  return payload;
};

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
    const payload = normalizeRestaurantPayload(req.body);

    // Add owner to payload
    payload.owner = req.user.id;

    // Add image path if uploaded
    if (req.file) {
      payload.image = `/uploads/products/${req.file.filename}`;
    }

    const restaurant = await Restaurant.create(payload);

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

    const payload = normalizeRestaurantPayload(req.body);

    // Add image path if uploaded
    if (req.file) {
      payload.image = `/uploads/products/${req.file.filename}`;
    }

    // Never allow owner reassignment from this endpoint.
    delete payload.owner;

    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, payload, {
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
