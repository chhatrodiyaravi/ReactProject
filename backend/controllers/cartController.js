import Cart from "../models/Cart.js";
import Food from "../models/Food.js";

const normalizeCartForResponse = (cartDoc) => {
  const cart = cartDoc?.toObject ? cartDoc.toObject() : cartDoc;
  const items = (cart?.items || []).map((item) => {
    const unitPrice = Number(item?.price ?? item?.food?.price ?? 0);
    const quantity = Number(item?.quantity ?? 0);

    return {
      ...item,
      unitPrice,
      lineTotal: unitPrice * quantity,
    };
  });

  const totalPrice = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    ...cart,
    items,
    totalPrice,
  };
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate("items.food", "name price image isAvailable")
      .populate("items.restaurant", "name");

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
        totalPrice: 0,
      });
    }

    const normalizedCart = normalizeCartForResponse(cart);

    res.status(200).json({
      success: true,
      data: normalizedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { foodId } = req.body;
    const quantity = Number(req.body.quantity) || 1;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Check if food exists
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    if (!food.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Food item is not available",
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
        totalPrice: 0,
      });
    }

    // Check if item already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.food.toString() === foodId,
    );

    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        food: foodId,
        quantity,
        price: food.price,
        restaurant: food.restaurant,
      });
    }

    // Calculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    await cart.save();

    // Populate and return
    cart = await Cart.findById(cart._id)
      .populate("items.food", "name price image isAvailable")
      .populate("items.restaurant", "name");

    const normalizedCart = normalizeCartForResponse(cart);

    res.status(200).json({
      success: true,
      data: normalizedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const quantity = Number(req.body.quantity);

    if (Number.isNaN(quantity)) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a valid number",
      });
    }

    console.log("=== updateCartItem called ===");
    console.log("User ID:", req.user.id);
    console.log("Item ID:", req.params.itemId);
    console.log("New Quantity:", quantity);

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      console.log("Cart not found for user");
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    console.log(
      "Cart items:",
      cart.items.map((i) => ({ id: i._id, quantity: i.quantity })),
    );

    const item = cart.items.id(req.params.itemId);
    console.log("Item found:", !!item);
    if (!item) {
      console.log("Item not found in cart");
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (quantity <= 0) {
      item.deleteOne();
    } else {
      item.quantity = quantity;
    }

    // Calculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    await cart.save();

    // Populate and return
    const populatedCart = await Cart.findById(cart._id)
      .populate("items.food", "name price image isAvailable")
      .populate("items.restaurant", "name");

    console.log("Sending updated cart:", populatedCart.items.length, "items");
    const normalizedCart = normalizeCartForResponse(populatedCart);

    res.status(200).json({
      success: true,
      data: normalizedCart,
    });
  } catch (error) {
    console.error("updateCartItem error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    console.log("=== removeFromCart called ===");
    console.log("User ID:", req.user.id);
    console.log("Item ID:", req.params.itemId);

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      console.log("Cart not found for user");
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      console.log("Item not found in cart");
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    item.deleteOne();

    // Calculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    await cart.save();

    // Populate and return
    const populatedCart = await Cart.findById(cart._id)
      .populate("items.food", "name price image isAvailable")
      .populate("items.restaurant", "name");

    console.log("Item removed, sending updated cart");
    const normalizedCart = normalizeCartForResponse(populatedCart);

    res.status(200).json({
      success: true,
      data: normalizedCart,
    });
  } catch (error) {
    console.error("removeFromCart error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    const normalizedCart = normalizeCartForResponse(cart);

    res.status(200).json({
      success: true,
      data: normalizedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
