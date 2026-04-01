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

const foodImageByName = {
  "Margherita Pizza":
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&h=700&fit=crop",
  "Farmhouse Pizza":
    "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=900&h=700&fit=crop",
  "Pepperoni Pizza":
    "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&h=700&fit=crop",
  "Veggie Supreme Pizza":
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&h=700&fit=crop",
  "Cheese Burst Pizza":
    "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=900&h=700&fit=crop",
  "Garlic Bread Sticks":
    "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=900&h=700&fit=crop",
  "Cheesy Garlic Bread":
    "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=900&h=700&fit=crop",
  "Pasta Alfredo":
    "https://images.unsplash.com/photo-1645112411341-6c4fd023882c?w=900&h=700&fit=crop",
  "Tiramisu Cup":
    "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=900&h=700&fit=crop",
  "Chocolate Lava Cake":
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&h=700&fit=crop",
  "Fresh Lime Soda":
    "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=900&h=700&fit=crop",
  "Classic Chicken Burger":
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&h=700&fit=crop",
  "Paneer Crunch Burger":
    "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=900&h=700&fit=crop",
  "Double Cheese Burger":
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=900&h=700&fit=crop",
  "Spicy Zinger Burger":
    "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=900&h=700&fit=crop",
  "Aloo Tikki Burger":
    "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=900&h=700&fit=crop",
  "Loaded Cheese Fries":
    "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=900&h=700&fit=crop",
  "Peri Peri Fries":
    "https://images.unsplash.com/photo-1639744091269-4f0f3d7f2a75?w=900&h=700&fit=crop",
  "Onion Rings":
    "https://images.unsplash.com/photo-1639024471283-03518883512d?w=900&h=700&fit=crop",
  "Chicken Nuggets":
    "https://images.unsplash.com/photo-1562967914-608f82629710?w=900&h=700&fit=crop",
  "Chocolate Thick Shake":
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=900&h=700&fit=crop",
  "Cold Coffee":
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=900&h=700&fit=crop",
  "Veg Hakka Noodles":
    "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=900&h=700&fit=crop",
  "Chicken Fried Rice":
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=900&h=700&fit=crop",
  "Schezwan Noodles":
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=900&h=700&fit=crop",
  "Paneer Chilli Gravy":
    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=900&h=700&fit=crop",
  "Chicken Manchurian":
    "https://images.unsplash.com/photo-1576867757603-05b134ebc379?w=900&h=700&fit=crop",
  "Steamed Veg Momos":
    "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=900&h=700&fit=crop",
  "Fried Chicken Momos":
    "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=900&h=700&fit=crop",
  "Spring Rolls":
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=900&h=700&fit=crop",
  "Hot and Sour Soup":
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=900&h=700&fit=crop",
  "Lychee Cooler":
    "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=900&h=700&fit=crop",
  "Honey Noodles with Ice Cream":
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=900&h=700&fit=crop",
};

const foodImageByCategory = {
  "Main Course":
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&h=700&fit=crop",
  Appetizer:
    "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=900&h=700&fit=crop",
  Snack:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&h=700&fit=crop",
  Dessert:
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&h=700&fit=crop",
  Beverage:
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&h=700&fit=crop",
  Other:
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=900&h=700&fit=crop",
};

const resolveFoodImage = (name, category) => {
  return (
    foodImageByName[name] ||
    foodImageByCategory[category] ||
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=900&h=700&fit=crop"
  );
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
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop",
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
        name: "Pepperoni Pizza",
        description: "Loaded with pepperoni and extra cheese.",
        price: 449,
        category: "Main Course",
        isVegetarian: false,
        spicyLevel: "Mild",
        ingredients: ["Pepperoni", "Mozzarella", "Tomato Sauce", "Olives"],
        allergens: ["Dairy", "Gluten"],
        preparationTime: 22,
      },
      {
        name: "Veggie Supreme Pizza",
        description: "Capsicum, sweet corn, olives, onion, and tomato.",
        price: 429,
        category: "Main Course",
        isVegetarian: true,
        spicyLevel: "Mild",
        ingredients: ["Capsicum", "Corn", "Olives", "Onion", "Cheese"],
        allergens: ["Dairy", "Gluten"],
        preparationTime: 23,
      },
      {
        name: "Cheese Burst Pizza",
        description: "Pizza with rich molten cheese center.",
        price: 499,
        category: "Main Course",
        isVegetarian: true,
        spicyLevel: "None",
        ingredients: ["Cheese", "Flour", "Tomato Sauce", "Herbs"],
        allergens: ["Dairy", "Gluten"],
        preparationTime: 24,
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
      {
        name: "Cheesy Garlic Bread",
        description: "Toasted garlic bread loaded with mozzarella.",
        price: 199,
        category: "Appetizer",
        isVegetarian: true,
        spicyLevel: "None",
        ingredients: ["Bread", "Garlic", "Mozzarella", "Butter"],
        allergens: ["Dairy", "Gluten"],
        preparationTime: 13,
      },
      {
        name: "Pasta Alfredo",
        description: "Creamy white sauce pasta with herbs.",
        price: 289,
        category: "Main Course",
        isVegetarian: true,
        spicyLevel: "None",
        ingredients: ["Pasta", "Cream", "Cheese", "Garlic"],
        allergens: ["Dairy", "Gluten"],
        preparationTime: 18,
      },
      {
        name: "Tiramisu Cup",
        description: "Coffee-flavored classic Italian dessert.",
        price: 179,
        category: "Dessert",
        isVegetarian: true,
        spicyLevel: "None",
        ingredients: ["Mascarpone", "Coffee", "Cocoa", "Sponge"],
        allergens: ["Dairy", "Gluten", "Egg"],
        preparationTime: 8,
      },
      {
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with gooey center.",
        price: 159,
        category: "Dessert",
        isVegetarian: true,
        spicyLevel: "None",
        ingredients: ["Chocolate", "Flour", "Butter", "Sugar"],
        allergens: ["Dairy", "Gluten", "Egg"],
        preparationTime: 12,
      },
      {
        name: "Fresh Lime Soda",
        description: "Refreshing sweet and salty lime soda.",
        price: 99,
        category: "Beverage",
        isVegetarian: true,
        spicyLevel: "None",
        ingredients: ["Lime", "Soda", "Sugar", "Salt"],
        allergens: [],
        preparationTime: 5,
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
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=800&fit=crop",
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
        name: "Double Cheese Burger",
        description: "Double patty burger with cheddar and house sauce.",
        price: 299,
        category: "Main Course",
        isVegetarian: false,
        spicyLevel: "Mild",
        ingredients: ["Chicken Patty", "Cheddar", "Onion", "Bun", "Sauce"],
        allergens: ["Dairy", "Gluten", "Egg"],
        preparationTime: 20,
      },
      {
        name: "Spicy Zinger Burger",
        description: "Crunchy spicy chicken fillet with lettuce.",
        price: 279,
        category: "Main Course",
        isVegetarian: false,
        spicyLevel: "Hot",
        ingredients: ["Chicken Fillet", "Lettuce", "Sauce", "Bun"],
        allergens: ["Gluten", "Egg"],
        preparationTime: 19,
      },
      {
        name: "Aloo Tikki Burger",
        description: "Indian-style potato patty burger with tangy chutney.",
        price: 179,
        category: "Main Course",
        isVegetarian: true,
        spicyLevel: "Medium",
        ingredients: ["Potato Patty", "Onion", "Lettuce", "Bun", "Chutney"],
        allergens: ["Gluten"],
        preparationTime: 15,
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
      {
        name: "Peri Peri Fries",
        description: "Crispy fries tossed in peri peri seasoning.",
        price: 149,
        category: "Snack",
        isVegetarian: true,
        spicyLevel: "Medium",
        ingredients: ["Potato", "Peri Peri Seasoning", "Salt"],
        allergens: [],
        preparationTime: 9,
      },
      {
        name: "Onion Rings",
        description: "Golden fried onion rings with dip.",
        price: 159,
        category: "Snack",
        isVegetarian: true,
        spicyLevel: "None",
        ingredients: ["Onion", "Flour", "Breadcrumbs", "Oil"],
        allergens: ["Gluten"],
        preparationTime: 11,
      },
      {
        name: "Chicken Nuggets",
        description: "Crispy chicken nuggets served with mayo dip.",
        price: 199,
        category: "Snack",
        isVegetarian: false,
        spicyLevel: "Mild",
        ingredients: ["Chicken", "Breadcrumbs", "Seasoning", "Oil"],
        allergens: ["Gluten"],
        preparationTime: 12,
      },
      {
        name: "Chocolate Thick Shake",
        description: "Creamy chocolate shake topped with whipped cream.",
        price: 169,
        category: "Beverage",
        isVegetarian: true,
        spicyLevel: "None",
        ingredients: ["Milk", "Chocolate", "Ice Cream", "Sugar"],
        allergens: ["Dairy"],
        preparationTime: 7,
      },
      {
        name: "Cold Coffee",
        description: "Frothy chilled coffee with ice cream.",
        price: 149,
        category: "Beverage",
        isVegetarian: true,
        spicyLevel: "None",
        ingredients: ["Milk", "Coffee", "Ice Cream", "Sugar"],
        allergens: ["Dairy"],
        preparationTime: 6,
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
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop",
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
        name: "Schezwan Noodles",
        description: "Spicy schezwan noodles with crunchy vegetables.",
        price: 239,
        category: "Main Course",
        isVegetarian: true,
        spicyLevel: "Hot",
        ingredients: ["Noodles", "Schezwan Sauce", "Capsicum", "Carrot"],
        allergens: ["Gluten", "Soy"],
        preparationTime: 16,
      },
      {
        name: "Paneer Chilli Gravy",
        description: "Paneer cubes tossed in tangy chilli gravy.",
        price: 269,
        category: "Main Course",
        isVegetarian: true,
        spicyLevel: "Medium",
        ingredients: ["Paneer", "Onion", "Capsicum", "Soy Sauce"],
        allergens: ["Dairy", "Soy"],
        preparationTime: 18,
      },
      {
        name: "Chicken Manchurian",
        description: "Juicy chicken balls in savory manchurian sauce.",
        price: 289,
        category: "Main Course",
        isVegetarian: false,
        spicyLevel: "Medium",
        ingredients: ["Chicken", "Garlic", "Soy Sauce", "Corn Flour"],
        allergens: ["Soy", "Gluten"],
        preparationTime: 19,
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
      {
        name: "Fried Chicken Momos",
        description: "Crispy fried momos stuffed with spicy chicken.",
        price: 209,
        category: "Appetizer",
        isVegetarian: false,
        spicyLevel: "Medium",
        ingredients: ["Flour", "Chicken", "Onion", "Garlic", "Pepper"],
        allergens: ["Gluten"],
        preparationTime: 15,
      },
      {
        name: "Spring Rolls",
        description: "Crunchy vegetable spring rolls with sweet chilli dip.",
        price: 179,
        category: "Appetizer",
        isVegetarian: true,
        spicyLevel: "Mild",
        ingredients: ["Cabbage", "Carrot", "Wrapper", "Sauce"],
        allergens: ["Gluten", "Soy"],
        preparationTime: 13,
      },
      {
        name: "Hot and Sour Soup",
        description: "Classic Indo-Chinese hot and sour soup.",
        price: 139,
        category: "Appetizer",
        isVegetarian: true,
        spicyLevel: "Medium",
        ingredients: ["Mushroom", "Carrot", "Pepper", "Vinegar"],
        allergens: ["Soy"],
        preparationTime: 10,
      },
      {
        name: "Lychee Cooler",
        description: "Sweet chilled lychee cooler.",
        price: 119,
        category: "Beverage",
        isVegetarian: true,
        spicyLevel: "None",
        ingredients: ["Lychee", "Ice", "Mint", "Syrup"],
        allergens: [],
        preparationTime: 5,
      },
      {
        name: "Honey Noodles with Ice Cream",
        description: "Crispy noodles tossed in honey with vanilla ice cream.",
        price: 189,
        category: "Dessert",
        isVegetarian: true,
        spicyLevel: "None",
        ingredients: ["Noodles", "Honey", "Sesame", "Vanilla Ice Cream"],
        allergens: ["Dairy", "Gluten"],
        preparationTime: 9,
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
      image: food.image || resolveFoodImage(food.name, food.category),
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
