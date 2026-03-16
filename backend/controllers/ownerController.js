import Order from "../models/Order.js";
import Food from "../models/Food.js";
import Restaurant from "../models/Restaurant.js";
import OwnerAnalytics from "../models/OwnerAnalytics.js";
import OwnerActivity from "../models/OwnerActivity.js";

// @desc    Get owner's restaurant
// @route   GET /api/owner/restaurant
// @access  Private/Owner
export const getOwnerRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      owner: req.user.id,
    }).populate("owner", "name email phone");

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
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

// @desc    Get owner's menu
// @route   GET /api/owner/menu
// @access  Private/Owner
export const getOwnerMenu = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const foods = await Food.find({ restaurant: restaurant._id }).sort({
      createdAt: -1,
    });

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

// @desc    Add food item
// @route   POST /api/owner/menu
// @access  Private/Owner
export const addFoodItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      isVegetarian,
      isVegan,
      spicyLevel,
      ingredients,
      allergens,
      calories,
      preparationTime,
    } = req.body;

    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (!name || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const food = await Food.create({
      name,
      description,
      price,
      category,
      restaurant: restaurant._id,
      owner: req.user.id,
      image: req.file ? `/uploads/products/${req.file.filename}` : "",
      isVegetarian,
      isVegan,
      spicyLevel,
      ingredients,
      allergens,
      calories,
      preparationTime,
    });

    // Log activity
    await OwnerActivity.create({
      owner: req.user.id,
      restaurant: restaurant._id,
      activityType: "add_food",
      entityType: "food",
      entityId: food._id,
      entityName: food.name,
      description: `Added food item: ${food.name}`,
      status: "success",
    });

    res.status(201).json({
      success: true,
      message: "Food item added successfully",
      data: food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Edit food item
// @route   PUT /api/owner/menu/:id
// @access  Private/Owner
export const editFoodItem = async (req, res) => {
  try {
    const { name, description, price, isAvailable, preparationTime } = req.body;

    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    if (String(food.owner) !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this food item",
      });
    }

    const changes = {};

    if (name && name !== food.name) {
      changes.name = `${food.name} -> ${name}`;
      food.name = name;
    }
    if (description && description !== food.description) {
      changes.description = "Updated";
      food.description = description;
    }
    if (price && price !== food.price) {
      changes.price = `${food.price} -> ${price}`;
      food.price = price;
    }
    if (isAvailable !== undefined && isAvailable !== food.isAvailable) {
      changes.isAvailable = `${food.isAvailable} -> ${isAvailable}`;
      food.isAvailable = isAvailable;
    }
    if (preparationTime && preparationTime !== food.preparationTime) {
      changes.preparationTime = `${food.preparationTime} -> ${preparationTime}`;
      food.preparationTime = preparationTime;
    }

    const updatedFood = await food.save();

    // Log activity
    await OwnerActivity.create({
      owner: req.user.id,
      restaurant: food.restaurant,
      activityType: "edit_food",
      entityType: "food",
      entityId: food._id,
      entityName: food.name,
      description: `Edited food item: ${food.name}`,
      changes,
      status: "success",
    });

    res.status(200).json({
      success: true,
      message: "Food item updated successfully",
      data: updatedFood,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete food item
// @route   DELETE /api/owner/menu/:id
// @access  Private/Owner
export const deleteFoodItem = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    if (String(food.owner) !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this food item",
      });
    }

    await Food.findByIdAndDelete(req.params.id);

    // Log activity
    await OwnerActivity.create({
      owner: req.user.id,
      restaurant: food.restaurant,
      activityType: "delete_food",
      entityType: "food",
      entityId: food._id,
      entityName: food.name,
      description: `Deleted food item: ${food.name}`,
      status: "success",
    });

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

// @desc    Get pending orders
// @route   GET /api/owner/orders
// @access  Private/Owner
export const getOwnerOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const query = {
      "orderItems.restaurant": restaurant._id,
    };

    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate("user", "name email phone address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Accept order
// @route   PUT /api/owner/orders/:id/accept
// @access  Private/Owner
export const acceptOrder = async (req, res) => {
  try {
    const { estimatedDeliveryTime } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.acceptOrder(req.user.id, estimatedDeliveryTime || 30);

    // Log activity
    await OwnerActivity.create({
      owner: req.user.id,
      restaurant: order.orderItems[0].restaurant,
      activityType: "accept_order",
      entityType: "order",
      entityId: order._id,
      description: `Accepted order: ${order._id}`,
      status: "success",
    });

    res.status(200).json({
      success: true,
      message: "Order accepted successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reject order
// @route   PUT /api/owner/orders/:id/reject
// @access  Private/Owner
export const rejectOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Please provide a rejection reason",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.rejectOrder(req.user.id, reason);

    // Log activity
    await OwnerActivity.create({
      owner: req.user.id,
      restaurant: order.orderItems[0].restaurant,
      activityType: "reject_order",
      entityType: "order",
      entityId: order._id,
      description: `Rejected order: ${order._id} - Reason: ${reason}`,
      status: "success",
    });

    res.status(200).json({
      success: true,
      message: "Order rejected successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/owner/orders/:id/status
// @access  Private/Owner
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, notes } = req.body;

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: "Please provide order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.updateStatus(orderStatus, notes);

    // Log activity
    await OwnerActivity.create({
      owner: req.user.id,
      restaurant: order.orderItems[0].restaurant,
      activityType: "update_order_status",
      entityType: "order",
      entityId: order._id,
      description: `Updated order status to: ${orderStatus}`,
      changes: { orderStatus },
      status: "success",
    });

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update restaurant info
// @route   PUT /api/owner/restaurant
// @access  Private/Owner
export const updateRestaurantInfo = async (req, res) => {
  try {
    const { address, openingHours, deliveryTime, phone, email, description } =
      req.body;

    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const changes = {};

    if (address) {
      changes.address = "Updated";
      restaurant.address = address;
    }
    if (openingHours) {
      changes.openingHours = "Updated";
      restaurant.openingHours = openingHours;
    }
    if (deliveryTime) {
      changes.deliveryTime = "Updated";
      await restaurant.updateDeliveryTime(deliveryTime.min, deliveryTime.max);
    }
    if (phone) {
      changes.phone = `${restaurant.phone} -> ${phone}`;
      restaurant.phone = phone;
    }
    if (email) {
      changes.email = `${restaurant.email} -> ${email}`;
      restaurant.email = email;
    }
    if (description) {
      changes.description = "Updated";
      restaurant.description = description;
    }

    const updated = await restaurant.save();

    // Log activity
    await OwnerActivity.create({
      owner: req.user.id,
      restaurant: restaurant._id,
      activityType: "update_restaurant_info",
      entityType: "restaurant",
      entityId: restaurant._id,
      entityName: restaurant.name,
      description: "Updated restaurant information",
      changes,
      status: "success",
    });

    res.status(200).json({
      success: true,
      message: "Restaurant info updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get owner analytics
// @route   GET /api/owner/analytics
// @access  Private/Owner
export const getOwnerAnalytics = async (req, res) => {
  try {
    const { type = "today" } = req.query;

    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    let analytics;

    switch (type) {
      case "week":
        analytics = await OwnerAnalytics.getWeekAnalytics(restaurant._id);
        break;
      case "today":
        analytics = await OwnerAnalytics.getTodayAnalytics(restaurant._id);
        break;
      case "cumulative":
        analytics = await OwnerAnalytics.getCumulativeAnalytics(restaurant._id);
        break;
      default:
        analytics = await OwnerAnalytics.getTodayAnalytics(restaurant._id);
    }

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get owner activity logs
// @route   GET /api/owner/activities
// @access  Private/Owner
export const getOwnerActivityLogs = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const activities = await OwnerActivity.getRestaurantActivities(
      restaurant._id,
    );

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
