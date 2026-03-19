import Coupon from "../models/Coupon.js";
import Restaurant from "../models/Restaurant.js";
import AdminActivity from "../models/AdminActivity.js";
import OwnerActivity from "../models/OwnerActivity.js";

const parseDate = (value) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const sanitizeCouponInput = ({ body, ownerRestaurantId }) => {
  const coupon = {
    code: body.code ? String(body.code).trim().toUpperCase() : undefined,
    description: body.description,
    discountType: body.discountType,
    discountValue:
      body.discountValue !== undefined ? Number(body.discountValue) : undefined,
    maxDiscount:
      body.maxDiscount !== undefined && body.maxDiscount !== ""
        ? Number(body.maxDiscount)
        : undefined,
    minOrderAmount:
      body.minOrderAmount !== undefined && body.minOrderAmount !== ""
        ? Number(body.minOrderAmount)
        : undefined,
    usageLimit:
      body.usageLimit !== undefined && body.usageLimit !== ""
        ? Number(body.usageLimit)
        : undefined,
    userUsageLimit:
      body.userUsageLimit !== undefined && body.userUsageLimit !== ""
        ? Number(body.userUsageLimit)
        : undefined,
    startDate: parseDate(body.startDate),
    expirationDate: parseDate(body.expirationDate),
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
  };

  if (ownerRestaurantId) {
    coupon.applicableRestaurants = [ownerRestaurantId];
  } else if (Array.isArray(body.applicableRestaurants)) {
    coupon.applicableRestaurants = body.applicableRestaurants;
  }

  if (Array.isArray(body.applicableCategories)) {
    coupon.applicableCategories = body.applicableCategories;
  }

  return coupon;
};

const requireValidCouponFields = ({ coupon, res }) => {
  if (
    !coupon.code ||
    !coupon.discountType ||
    coupon.discountValue === undefined
  ) {
    res.status(400).json({
      success: false,
      message: "Please provide code, discountType and discountValue",
    });
    return false;
  }

  if (!["percentage", "fixed"].includes(coupon.discountType)) {
    res.status(400).json({
      success: false,
      message: "discountType must be percentage or fixed",
    });
    return false;
  }

  if (!coupon.startDate || !coupon.expirationDate) {
    res.status(400).json({
      success: false,
      message: "Please provide valid startDate and expirationDate",
    });
    return false;
  }

  if (coupon.expirationDate <= coupon.startDate) {
    res.status(400).json({
      success: false,
      message: "expirationDate must be later than startDate",
    });
    return false;
  }

  return true;
};

// @desc    Get all coupons (admin)
// @route   GET /api/admin/coupons
// @access  Private/Admin
export const getAdminCoupons = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status === "active") {
      query.isActive = true;
    } else if (status === "inactive") {
      query.isActive = false;
    }

    if (search) {
      const pattern = new RegExp(search, "i");
      query.$or = [{ code: pattern }, { description: pattern }];
    }

    const coupons = await Coupon.find(query)
      .populate("createdBy", "name email role")
      .populate("applicableRestaurants", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create coupon (admin)
// @route   POST /api/admin/coupons
// @access  Private/Admin
export const createAdminCoupon = async (req, res) => {
  try {
    const couponData = sanitizeCouponInput({ body: req.body });

    if (!requireValidCouponFields({ coupon: couponData, res })) {
      return;
    }

    const existing = await Coupon.findOne({ code: couponData.code });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    couponData.createdBy = req.user.id;

    const coupon = await Coupon.create(couponData);

    await AdminActivity.create({
      admin: req.user.id,
      actionType: "create_coupon",
      entityType: "system",
      entityId: coupon._id,
      entityName: coupon.code,
      description: `Created coupon: ${coupon.code}`,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update coupon (admin)
// @route   PUT /api/admin/coupons/:id
// @access  Private/Admin
export const updateAdminCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    const updates = sanitizeCouponInput({ body: req.body });

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        coupon[key] = value;
      }
    });

    if (
      coupon.startDate &&
      coupon.expirationDate &&
      coupon.expirationDate <= coupon.startDate
    ) {
      return res.status(400).json({
        success: false,
        message: "expirationDate must be later than startDate",
      });
    }

    await coupon.save();

    await AdminActivity.create({
      admin: req.user.id,
      actionType: "update_coupon",
      entityType: "system",
      entityId: coupon._id,
      entityName: coupon.code,
      description: `Updated coupon: ${coupon.code}`,
    });

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete coupon (admin)
// @route   DELETE /api/admin/coupons/:id
// @access  Private/Admin
export const deleteAdminCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    await AdminActivity.create({
      admin: req.user.id,
      actionType: "delete_coupon",
      entityType: "system",
      entityId: coupon._id,
      entityName: coupon.code,
      description: `Deleted coupon: ${coupon.code}`,
    });

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get owner coupons
// @route   GET /api/owner/coupons
// @access  Private/Owner
export const getOwnerCoupons = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for owner",
      });
    }

    const coupons = await Coupon.find({
      createdBy: req.user.id,
      applicableRestaurants: restaurant._id,
    })
      .populate("applicableRestaurants", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create coupon (owner)
// @route   POST /api/owner/coupons
// @access  Private/Owner
export const createOwnerCoupon = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for owner",
      });
    }

    const couponData = sanitizeCouponInput({
      body: req.body,
      ownerRestaurantId: restaurant._id,
    });

    if (!requireValidCouponFields({ coupon: couponData, res })) {
      return;
    }

    const existing = await Coupon.findOne({ code: couponData.code });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    couponData.createdBy = req.user.id;

    const coupon = await Coupon.create(couponData);

    await OwnerActivity.create({
      owner: req.user.id,
      restaurant: restaurant._id,
      activityType: "create_coupon",
      entityType: "coupon",
      entityId: coupon._id,
      entityName: coupon.code,
      description: `Created coupon: ${coupon.code}`,
      status: "success",
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update coupon (owner)
// @route   PUT /api/owner/coupons/:id
// @access  Private/Owner
export const updateOwnerCoupon = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for owner",
      });
    }

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    if (String(coupon.createdBy) !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this coupon",
      });
    }

    const updates = sanitizeCouponInput({
      body: req.body,
      ownerRestaurantId: restaurant._id,
    });

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        coupon[key] = value;
      }
    });

    if (
      coupon.startDate &&
      coupon.expirationDate &&
      coupon.expirationDate <= coupon.startDate
    ) {
      return res.status(400).json({
        success: false,
        message: "expirationDate must be later than startDate",
      });
    }

    await coupon.save();

    await OwnerActivity.create({
      owner: req.user.id,
      restaurant: restaurant._id,
      activityType: "update_coupon",
      entityType: "coupon",
      entityId: coupon._id,
      entityName: coupon.code,
      description: `Updated coupon: ${coupon.code}`,
      status: "success",
    });

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete coupon (owner)
// @route   DELETE /api/owner/coupons/:id
// @access  Private/Owner
export const deleteOwnerCoupon = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for owner",
      });
    }

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    if (String(coupon.createdBy) !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this coupon",
      });
    }

    await Coupon.findByIdAndDelete(req.params.id);

    await OwnerActivity.create({
      owner: req.user.id,
      restaurant: restaurant._id,
      activityType: "delete_coupon",
      entityType: "coupon",
      entityId: coupon._id,
      entityName: coupon.code,
      description: `Deleted coupon: ${coupon.code}`,
      status: "success",
    });

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
