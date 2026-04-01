import dotenv from "dotenv";
import connectDB from "../config/database.js";
import Cart from "../models/Cart.js";
import Food from "../models/Food.js";

dotenv.config({ path: ".env" });

const dryRun = process.argv.includes("--dry-run");

const isValidPrice = (value) => {
  const price = Number(value);
  return Number.isFinite(price) && price >= 0;
};

const toObjectIdString = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value.toString) return value.toString();
  return "";
};

const run = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const carts = await Cart.find({ "items.0": { $exists: true } }).lean();

    if (carts.length === 0) {
      console.log("No carts with items found. Nothing to backfill.");
      process.exit(0);
    }

    const missingPriceFoodIds = new Set();

    for (const cart of carts) {
      for (const item of cart.items || []) {
        if (!isValidPrice(item.price)) {
          const foodId = toObjectIdString(item.food);
          if (foodId) {
            missingPriceFoodIds.add(foodId);
          }
        }
      }
    }

    const foods = await Food.find({
      _id: { $in: Array.from(missingPriceFoodIds) },
    })
      .select("_id price restaurant")
      .lean();

    const foodById = new Map(
      foods.map((food) => [toObjectIdString(food._id), food]),
    );

    let cartsScanned = 0;
    let cartsUpdated = 0;
    let itemPricesFixed = 0;
    let itemRestaurantsFixed = 0;
    let itemsStillUnresolved = 0;

    const bulkOps = [];

    for (const cart of carts) {
      cartsScanned += 1;
      let cartChanged = false;
      let recomputedTotal = 0;

      const nextItems = (cart.items || []).map((item) => {
        const nextItem = { ...item };
        const foodId = toObjectIdString(item.food);
        const food = foodById.get(foodId);

        if (!isValidPrice(nextItem.price) && isValidPrice(food?.price)) {
          nextItem.price = Number(food.price);
          itemPricesFixed += 1;
          cartChanged = true;
        }

        if (!nextItem.restaurant && food?.restaurant) {
          nextItem.restaurant = food.restaurant;
          itemRestaurantsFixed += 1;
          cartChanged = true;
        }

        if (!isValidPrice(nextItem.price)) {
          itemsStillUnresolved += 1;
          nextItem.price = 0;
        }

        const quantity = Number(nextItem.quantity);
        const safeQuantity =
          Number.isFinite(quantity) && quantity > 0 ? quantity : 0;
        recomputedTotal += Number(nextItem.price) * safeQuantity;

        return nextItem;
      });

      if (Number(cart.totalPrice || 0) !== recomputedTotal) {
        cartChanged = true;
      }

      if (cartChanged) {
        cartsUpdated += 1;

        bulkOps.push({
          updateOne: {
            filter: { _id: cart._id },
            update: {
              $set: {
                items: nextItems,
                totalPrice: recomputedTotal,
                updatedAt: new Date(),
              },
            },
          },
        });
      }
    }

    if (!dryRun && bulkOps.length > 0) {
      await Cart.bulkWrite(bulkOps, { ordered: false });
    }

    console.log("\nBackfill summary:");
    console.log(`- Dry run: ${dryRun ? "yes" : "no"}`);
    console.log(`- Carts scanned: ${cartsScanned}`);
    console.log(`- Carts updated: ${cartsUpdated}`);
    console.log(`- Item prices fixed: ${itemPricesFixed}`);
    console.log(`- Item restaurants fixed: ${itemRestaurantsFixed}`);
    console.log(`- Items still unresolved: ${itemsStillUnresolved}`);

    if (dryRun) {
      console.log("\nNo database changes were made (dry run).");
    }

    process.exit(0);
  } catch (error) {
    console.error("Backfill failed:", error);
    process.exit(1);
  }
};

run();
