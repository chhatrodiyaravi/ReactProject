import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";
import User from "../models/User.js";
import AdminDashboard from "../models/AdminDashboard.js";
import AdminActivity from "../models/AdminActivity.js";
import Dispute from "../models/Dispute.js";
import Category from "../models/Category.js";

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalOrders = await Order.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments({
      approvalStatus: "approved",
    });
    const totalUsers = await User.countDocuments({ role: "user" });
    const activeRestaurants = await Restaurant.countDocuments({
      isActive: true,
      isSuspended: false,
    });
    const suspendedRestaurants = await Restaurant.countDocuments({
      isSuspended: true,
    });
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const activeUsers = await User.countDocuments({
      role: "user",
      isBlocked: false,
    });
    const pendingDisputes = await Dispute.countDocuments({
      status: { $in: ["open", "under_review"] },
    });
    const pendingApprovals = await Restaurant.countDocuments({
      approvalStatus: "pending",
    });

    // Today's stats
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });
    const deliveredOrdersToday = await Order.countDocuments({
      orderStatus: "Delivered",
      createdAt: { $gte: today, $lt: tomorrow },
    });
    const cancelledOrdersToday = await Order.countDocuments({
      orderStatus: "Cancelled",
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // Total revenue
    const revenueData = await Order.aggregate([
      {
        $match: { orderStatus: "Delivered" },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);
    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Today's revenue
    const todayRevenueData = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          createdAt: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);
    const revenueToday =
      todayRevenueData.length > 0 ? todayRevenueData[0].totalRevenue : 0;

    // Top restaurants
    const topRestaurants = await Order.aggregate([
      {
        $unwind: "$orderItems",
      },
      {
        $match: { orderStatus: "Delivered" },
      },
      {
        $group: {
          _id: "$orderItems.restaurant",
          orders: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { revenue: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "restaurants",
          localField: "_id",
          foreignField: "_id",
          as: "restaurant",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRestaurants,
        activeRestaurants,
        suspendedRestaurants,
        totalUsers,
        activeUsers,
        blockedUsers,
        pendingDisputes,
        pendingApprovals,
        todayOrders,
        deliveredOrdersToday,
        cancelledOrdersToday,
        totalRevenue,
        revenueToday,
        topRestaurants,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all restaurants (admin view)
// @route   GET /api/admin/restaurants
// @access  Private/Admin
export const getAllRestaurants = async (req, res) => {
  try {
    const { status, suspended } = req.query;
    const query = {};

    if (status) {
      query.approvalStatus = status;
    }
    if (suspended === "true") {
      query.isSuspended = true;
    }

    const restaurants = await Restaurant.find(query)
      .populate("owner", "name email phone")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

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

// @desc    Approve restaurant
// @route   PUT /api/admin/restaurants/:id/approve
// @access  Private/Admin
export const approveRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    await restaurant.approve(req.user.id);

    // Log admin activity
    await AdminActivity.create({
      admin: req.user.id,
      actionType: "approve_restaurant",
      entityType: "restaurant",
      entityId: restaurant._id,
      entityName: restaurant.name,
      description: `Approved restaurant: ${restaurant.name}`,
    });

    res.status(200).json({
      success: true,
      message: "Restaurant approved successfully",
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reject restaurant
// @route   PUT /api/admin/restaurants/:id/reject
// @access  Private/Admin
export const rejectRestaurant = async (req, res) => {
  try {
    const { reason } = req.body;

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    restaurant.approvalStatus = "rejected";
    restaurant.isActive = false;
    restaurant.isSuspended = false;
    restaurant.suspensionReason = reason || "Rejected by admin";
    restaurant.approvedAt = null;
    restaurant.approvedBy = null;
    await restaurant.save();

    await AdminActivity.create({
      admin: req.user.id,
      actionType: "reject_restaurant",
      entityType: "restaurant",
      entityId: restaurant._id,
      entityName: restaurant.name,
      description: `Rejected restaurant: ${restaurant.name}`,
      reason: reason || "Rejected by admin",
    });

    res.status(200).json({
      success: true,
      message: "Restaurant rejected successfully",
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Suspend restaurant
// @route   PUT /api/admin/restaurants/:id/suspend
// @access  Private/Admin
export const suspendRestaurant = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Please provide a suspension reason",
      });
    }

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    await restaurant.suspend(reason);

    // Log admin activity
    await AdminActivity.create({
      admin: req.user.id,
      actionType: "suspend_restaurant",
      entityType: "restaurant",
      entityId: restaurant._id,
      entityName: restaurant.name,
      description: `Suspended restaurant: ${restaurant.name} - Reason: ${reason}`,
      reason,
    });

    res.status(200).json({
      success: true,
      message: "Restaurant suspended successfully",
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Unsuspend restaurant
// @route   PUT /api/admin/restaurants/:id/unsuspend
// @access  Private/Admin
export const unsuspendRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    await restaurant.unsuspend();

    // Log admin activity
    await AdminActivity.create({
      admin: req.user.id,
      actionType: "unsuspend_restaurant",
      entityType: "restaurant",
      entityId: restaurant._id,
      entityName: restaurant.name,
      description: `Unsuspended restaurant: ${restaurant.name}`,
    });

    res.status(200).json({
      success: true,
      message: "Restaurant unsuspended successfully",
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users (admin view)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { blocked, role } = req.query;
    const query = {};

    if (blocked === "true") {
      query.isBlocked = true;
    } else if (blocked === "false") {
      query.isBlocked = false;
    }

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .populate("blockedBy", "name email")
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create user (admin)
// @route   POST /api/admin/users
// @access  Private/Admin
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role = "user" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    const allowedRoles = ["user", "owner", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
    });

    await AdminActivity.create({
      admin: req.user.id,
      actionType: "create_user",
      entityType: "user",
      entityId: user._id,
      entityName: user.name,
      description: `Created user: ${user.name} (${user.email})`,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create restaurant (admin)
// @route   POST /api/admin/restaurants
// @access  Private/Admin
export const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      ownerId,
      phone,
      email,
      cuisine,
      address,
      deliveryTime,
      isActive,
    } = req.body;

    if (!name || !description || !ownerId || !phone || !email) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide name, description, owner, phone and email for the restaurant",
      });
    }

    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner user not found",
      });
    }

    if (owner.role !== "owner") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not an owner",
      });
    }

    const restaurant = await Restaurant.create({
      name,
      description,
      owner: ownerId,
      phone,
      email,
      cuisine: Array.isArray(cuisine)
        ? cuisine
        : String(cuisine || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
      address: address || {},
      deliveryTime: deliveryTime || { min: 20, max: 45 },
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      approvalStatus: "approved",
      approvedBy: req.user.id,
      approvedAt: new Date(),
    });

    await AdminActivity.create({
      admin: req.user.id,
      actionType: "create_restaurant",
      entityType: "restaurant",
      entityId: restaurant._id,
      entityName: restaurant.name,
      description: `Created restaurant: ${restaurant.name}`,
    });

    const populatedRestaurant = await Restaurant.findById(restaurant._id)
      .populate("owner", "name email phone")
      .populate("approvedBy", "name email");

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: populatedRestaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Block user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
export const blockUser = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Please provide a blocking reason",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot block admin users",
      });
    }

    await user.block(reason, req.user.id);

    // Log admin activity
    await AdminActivity.create({
      admin: req.user.id,
      actionType: "block_user",
      entityType: "user",
      entityId: user._id,
      entityName: user.name,
      description: `Blocked user: ${user.name} - Reason: ${reason}`,
      reason,
    });

    res.status(200).json({
      success: true,
      message: "User blocked successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Unblock user
// @route   PUT /api/admin/users/:id/unblock
// @access  Private/Admin
export const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.unblock();

    // Log admin activity
    await AdminActivity.create({
      admin: req.user.id,
      actionType: "unblock_user",
      entityType: "user",
      entityId: user._id,
      entityName: user.name,
      description: `Unblocked user: ${user.name}`,
    });

    res.status(200).json({
      success: true,
      message: "User unblocked successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get pending disputes
// @route   GET /api/admin/disputes
// @access  Private/Admin
export const getPendingDisputes = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = { $in: ["open", "under_review"] };
    }

    const disputes = await Dispute.getPendingDisputes();

    res.status(200).json({
      success: true,
      count: disputes.length,
      data: disputes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Resolve dispute
// @route   PUT /api/admin/disputes/:id/resolve
// @access  Private/Admin
export const resolveDispute = async (req, res) => {
  try {
    const { resolution, refundAmount, adminNotes } = req.body;

    if (!resolution) {
      return res.status(400).json({
        success: false,
        message: "Please provide a resolution type",
      });
    }

    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: "Dispute not found",
      });
    }

    dispute.status = "resolved";
    dispute.resolution = resolution;
    dispute.refundAmount = refundAmount || 0;
    dispute.adminNotes = adminNotes || "";
    dispute.resolvedBy = req.user.id;
    dispute.resolvedAt = new Date();

    await dispute.save();

    // Log admin activity
    await AdminActivity.create({
      admin: req.user.id,
      actionType: "resolve_dispute",
      entityType: "dispute",
      entityId: dispute._id,
      description: `Resolved dispute - Resolution: ${resolution}`,
      changes: {
        resolution,
        refundAmount: refundAmount?.toString(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Dispute resolved successfully",
      data: dispute,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all orders (admin view)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate("user", "name email phone")
      .populate("orderItems.restaurant", "name")
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

// @desc    Get categories (admin view)
// @route   GET /api/admin/categories
// @access  Private/Admin
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("parent", "name")
      .populate("createdBy", "name email")
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

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    const { name, description, parent, displayOrder } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide a category name",
      });
    }

    const category = await Category.create({
      name,
      description,
      parent: parent || null,
      displayOrder: displayOrder || 0,
      createdBy: req.user.id,
    });

    // Log admin activity
    await AdminActivity.create({
      admin: req.user.id,
      actionType: "create_category",
      entityType: "category",
      entityId: category._id,
      entityName: category.name,
      description: `Created category: ${name}`,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    const { name, description, parent, displayOrder } = req.body;

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const changes = {};
    if (name && name !== category.name) {
      changes.name = `${category.name} -> ${name}`;
      category.name = name;
    }
    if (description && description !== category.description) {
      changes.description = "Updated";
      category.description = description;
    }
    if (parent && parent !== String(category.parent)) {
      changes.parent = "Updated";
      category.parent = parent;
    }
    if (displayOrder && displayOrder !== category.displayOrder) {
      changes.displayOrder = `${category.displayOrder} -> ${displayOrder}`;
      category.displayOrder = displayOrder;
    }

    category = await category.save();

    // Log admin activity
    await AdminActivity.create({
      admin: req.user.id,
      actionType: "update_category",
      entityType: "category",
      entityId: category._id,
      entityName: category.name,
      description: `Updated category: ${category.name}`,
      changes,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Log admin activity
    await AdminActivity.create({
      admin: req.user.id,
      actionType: "delete_category",
      entityType: "category",
      entityId: category._id,
      entityName: category.name,
      description: `Deleted category: ${category.name}`,
    });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get admin activity logs
// @route   GET /api/admin/activities
// @access  Private/Admin
export const getActivityLogs = async (req, res) => {
  try {
    const { actionType, entityType, limit = 50 } = req.query;
    const query = {};

    if (actionType) {
      query.actionType = actionType;
    }
    if (entityType) {
      query.entityType = entityType;
    }

    const activities = await AdminActivity.find(query)
      .populate("admin", "name email")
      .sort({ createdAt: -1 })
      .limit(Number(limit));

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
