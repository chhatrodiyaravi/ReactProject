import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a food name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
    min: 0,
  },
  category: {
    type: String,
    required: [true, "Please provide a category"],
    enum: ["Appetizer", "Main Course", "Dessert", "Beverage", "Snack", "Other"],
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  isVegetarian: {
    type: Boolean,
    default: false,
  },
  isVegan: {
    type: Boolean,
    default: false,
  },
  spicyLevel: {
    type: String,
    enum: ["None", "Mild", "Medium", "Hot", "Extra Hot"],
    default: "None",
  },
  ingredients: [
    {
      type: String,
    },
  ],
  allergens: [
    {
      type: String,
    },
  ],
  calories: {
    type: Number,
    min: 0,
  },
  preparationTime: {
    type: Number, // in minutes
    default: 30,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  images: [
    {
      type: String,
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  editHistory: [
    {
      editedAt: Date,
      editedBy: mongoose.Schema.Types.ObjectId,
      changes: Map,
    },
  ],
  totalOrders: {
    type: Number,
    default: 0,
  },
  popularity: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for owner queries
foodSchema.index({ restaurant: 1, owner: 1 });
foodSchema.index({ isAvailable: 1 });
foodSchema.index({ category: 1 });
foodSchema.index({ createdAt: -1 });
foodSchema.index({
  name: "text",
  description: "text",
  category: "text",
  ingredients: "text",
});

// Get food by restaurant for owner
foodSchema.statics.getRestaurantMenu = function (restaurantId) {
  return this.find({ restaurant: restaurantId }).sort({ createdAt: -1 });
};

// Toggle availability
foodSchema.methods.toggleAvailability = async function () {
  this.isAvailable = !this.isAvailable;
  return await this.save();
};

// Update edit history
foodSchema.methods.addEditHistory = async function (ownerId, changes) {
  if (!this.editHistory) {
    this.editHistory = [];
  }
  this.editHistory.push({
    editedAt: new Date(),
    editedBy: ownerId,
    changes: changes,
  });
  return await this.save();
};

export default mongoose.model("Food", foodSchema);
