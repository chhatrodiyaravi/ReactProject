import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/database.js";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import Food from "../models/Food.js";

dotenv.config({ path: ".env" });

const openingHours = {
  monday: { open: "09:00", close: "22:00" },
  tuesday: { open: "09:00", close: "22:00" },
  wednesday: { open: "09:00", close: "22:00" },
  thursday: { open: "09:00", close: "22:00" },
  friday: { open: "09:00", close: "23:00" },
  saturday: { open: "10:00", close: "23:00" },
  sunday: { open: "10:00", close: "21:00" },
};

const seedData = [
  {
    owner: {
      name: "Aarav Mehta",
      email: "owner.pizzapalace@foodhub.com",
      password: "Owner@123",
      phone: "+91-9876543210",
      role: "owner",
    },
    restaurant: {
      name: "Pizza Palace",
      description: "Stone-baked pizzas, garlic breads, and Italian favorites.",
      phone: "+91-9000011111",
      email: "contact@pizzapalace.in",
      cuisine: ["Italian", "Pizza"],
      address: {
        street: "12 Park Street",
        city: "Pune",
        state: "Maharashtra",
        zipCode: "411001",
        country: "India",
      },
      deliveryTime: { min: 25, max: 45 },
      approvalStatus: "pending",
      isActive: true,
    },
    foods: [
      {
        name: "Margherita Pizza",
        description: "Classic mozzarella, basil, and tomato sauce.",
        price: 299,
        category: "Main Course",
        isVegetarian: true,
        spicyLevel: "None",
        ingredients: ["Mozzarella", "Basil", "Tomato Sauce"],
        allergens: ["Dairy", "Gluten"],
        preparationTime: 20,
      },
      {
        name: "Farmhouse Pizza",
        description: "Loaded with onion, capsicum, tomato, and mushrooms.",
        price: 399,
        category: "Main Course",
        isVegetarian: true,
        spicyLevel: "Mild",
        ingredients: ["Onion", "Capsicum", "Tomato", "Mushroom", "Cheese"],
        allergens: ["Dairy", "Gluten"],
        preparationTime: 22,
      },
      {
        name: "Garlic Bread Sticks",
        description: "Crispy garlic bread with herbs and butter.",
        price: 149,
        category: "Appetizer",
        isVegetarian: true,
        spicyLevel: "None",
        ingredients: ["Bread", "Garlic", "Butter", "Herbs"],
        allergens: ["Dairy", "Gluten"],
        preparationTime: 12,
      },
    ],
  },
  {
    owner: {
      name: "Nisha Sharma",
      email: "owner.burgerbarn@foodhub.com",
      password: "Owner@123",
      phone: "+91-9876501234",
      role: "owner",
    },
    restaurant: {
      name: "Burger Barn",
      description: "Juicy burgers, loaded fries, and creamy shakes.",
      phone: "+91-9000022222",
      email: "hello@burgerbarn.in",
      cuisine: ["American", "Fast Food"],
      address: {
        street: "88 MG Road",
        city: "Bengaluru",
        state: "Karnataka",
        zipCode: "560001",
        country: "India",
      },
      deliveryTime: { min: 20, max: 35 },
      approvalStatus: "approved",
      isActive: true,
    },
    foods: [
      {
        name: "Classic Chicken Burger",
        description: "Grilled chicken patty, lettuce, onion, and mayo.",
        price: 249,
        category: "Main Course",
        isVegetarian: false,
        spicyLevel: "Mild",
        ingredients: ["Chicken Patty", "Lettuce", "Onion", "Mayo", "Bun"],
        allergens: ["Egg", "Gluten"],
        preparationTime: 18,
      },
      {
        name: "Paneer Crunch Burger",
        description: "Crispy paneer patty with spicy sauce and veggies.",
        price: 229,
        category: "Main Course",
        isVegetarian: true,
        spicyLevel: "Medium",
        ingredients: ["Paneer", "Spicy Sauce", "Lettuce", "Tomato", "Bun"],
        allergens: ["Dairy", "Gluten"],
        preparationTime: 16,
      },
      {
        name: "Loaded Cheese Fries",
        description: "French fries topped with melted cheese and jalapenos.",
        price: 179,
        category: "Snack",
        isVegetarian: true,
        spicyLevel: "Medium",
        ingredients: ["Potato", "Cheese", "Jalapenos", "Seasoning"],
        allergens: ["Dairy"],
        preparationTime: 10,
      },
    ],
  },
  {
    owner: {
      name: "Rohit Verma",
      email: "owner.wokwonders@foodhub.com",
      password: "Owner@123",
      phone: "+91-9876599999",
      role: "owner",
    },
    restaurant: {
      name: "Wok Wonders",
      description: "Chinese bowls, noodles, momos, and stir-fried specials.",
      phone: "+91-9000033333",
      email: "support@wokwonders.in",
      cuisine: ["Chinese", "Asian"],
      address: {
        street: "21 Lake View",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500001",
        country: "India",
      },
      deliveryTime: { min: 30, max: 50 },
      approvalStatus: "approved",
      isActive: true,
    },
    foods: [
      {
        name: "Veg Hakka Noodles",
        description: "Wok-tossed noodles with vegetables and sauces.",
        price: 219,
        category: "Main Course",
        isVegetarian: true,
        spicyLevel: "Medium",
        ingredients: ["Noodles", "Cabbage", "Carrot", "Bell Pepper", "Sauces"],
        allergens: ["Gluten", "Soy"],
        preparationTime: 15,
      },
      {
        name: "Chicken Fried Rice",
        description: "Fragrant fried rice with chicken and spring onions.",
        price: 249,
        category: "Main Course",
        isVegetarian: false,
        spicyLevel: "Mild",
        ingredients: ["Rice", "Chicken", "Egg", "Spring Onion", "Soy Sauce"],
        allergens: ["Egg", "Soy"],
        preparationTime: 17,
      },
      {
        name: "Steamed Veg Momos",
        description: "Soft dumplings stuffed with seasoned vegetables.",
        price: 169,
        category: "Appetizer",
        isVegetarian: true,
        spicyLevel: "None",
        ingredients: ["Flour", "Cabbage", "Carrot", "Onion", "Garlic"],
        allergens: ["Gluten"],
        preparationTime: 14,
      },
    ],
  },
];

const upsertOwner = async (ownerData) => {
  let owner = await User.findOne({ email: ownerData.email });

  if (!owner) {
    owner = await User.create(ownerData);
  } else {
    owner.name = ownerData.name;
    owner.phone = ownerData.phone;
    owner.role = "owner";
    owner.isBlocked = false;
    await owner.save();
  }

  return owner;
};

const upsertRestaurant = async (restaurantData, ownerId, adminId = null) => {
  let restaurant = await Restaurant.findOne({ email: restaurantData.email });

  const payload = {
    ...restaurantData,
    owner: ownerId,
    openingHours,
    approvedAt:
      restaurantData.approvalStatus === "approved" ? new Date() : undefined,
    approvedBy: restaurantData.approvalStatus === "approved" ? adminId : null,
  };

  if (!restaurant) {
    restaurant = await Restaurant.create(payload);
  } else {
    Object.assign(restaurant, payload);
    await restaurant.save();
  }

  return restaurant;
};

const upsertFoods = async (foods, restaurantId, ownerId) => {
  for (const food of foods) {
    const existing = await Food.findOne({
      name: food.name,
      restaurant: restaurantId,
    });

    const payload = {
      ...food,
      restaurant: restaurantId,
      owner: ownerId,
      image: food.image || "",
      isAvailable: true,
    };

    if (!existing) {
      await Food.create(payload);
    } else {
      Object.assign(existing, payload);
      await existing.save();
    }
  }
};

const seedRestaurantsAndFoods = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in backend/.env");
    }

    await connectDB();

    const admin = await User.findOne({ role: "admin" });

    for (const entry of seedData) {
      const owner = await upsertOwner(entry.owner);
      const restaurant = await upsertRestaurant(
        entry.restaurant,
        owner._id,
        admin?._id || null,
      );
      await upsertFoods(entry.foods, restaurant._id, owner._id);

      console.log(`Seeded: ${restaurant.name} (${entry.foods.length} items)`);
    }

    const totalOwners = await User.countDocuments({
      email: { $in: seedData.map((entry) => entry.owner.email) },
    });
    const totalRestaurants = await Restaurant.countDocuments({
      email: { $in: seedData.map((entry) => entry.restaurant.email) },
    });
    const totalFoods = await Food.countDocuments({
      restaurant: {
        $in: await Restaurant.find({
          email: { $in: seedData.map((entry) => entry.restaurant.email) },
        }).distinct("_id"),
      },
    });

    console.log("\nSeeding complete");
    console.log(`Owners: ${totalOwners}`);
    console.log(`Restaurants: ${totalRestaurants}`);
    console.log(`Foods: ${totalFoods}`);
    console.log("Owner password for all seeded owners: Owner@123");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedRestaurantsAndFoods();
