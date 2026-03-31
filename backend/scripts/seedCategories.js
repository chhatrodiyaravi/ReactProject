import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/database.js";
import Category from "../models/Category.js";

dotenv.config({ path: ".env" });

const categories = [
  {
    name: "Appetizers",
    slug: "appetizers",
    description: "Starters and appetizers to kick off your meal",
    icon: "🥘",
    displayOrder: 1,
    isActive: true,
  },
  {
    name: "Main Course",
    slug: "main-course",
    description: "Main dishes and entrées",
    icon: "🍽️",
    displayOrder: 2,
    isActive: true,
  },
  {
    name: "Desserts",
    slug: "desserts",
    description: "Sweet treats and desserts",
    icon: "🍰",
    displayOrder: 3,
    isActive: true,
  },
  {
    name: "Beverages",
    slug: "beverages",
    description: "Drinks and beverages",
    icon: "🥤",
    displayOrder: 4,
    isActive: true,
  },
  {
    name: "Snacks",
    slug: "snacks",
    description: "Light snacks and sides",
    icon: "🍟",
    displayOrder: 5,
    isActive: true,
  },
  {
    name: "Vegetarian",
    slug: "vegetarian",
    description: "Plant-based and vegetarian options",
    icon: "🥗",
    displayOrder: 6,
    isActive: true,
  },
  {
    name: "Non-Vegetarian",
    slug: "non-vegetarian",
    description: "Meat and seafood dishes",
    icon: "🍗",
    displayOrder: 7,
    isActive: true,
  },
  {
    name: "Breads",
    slug: "breads",
    description: "Fresh breads and bakery items",
    icon: "🍞",
    displayOrder: 8,
    isActive: true,
  },
];

const seedCategories = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("✓ Connected to MongoDB");

    // Clear existing categories
    await Category.deleteMany({});
    console.log("✓ Cleared existing categories");

    // Insert new categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✓ Seeded ${createdCategories.length} categories successfully`);

    // Display created categories
    console.log("\nCreated Categories:");
    createdCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (${cat.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("✗ Error seeding categories:", error.message);
    process.exit(1);
  }
};

seedCategories();
