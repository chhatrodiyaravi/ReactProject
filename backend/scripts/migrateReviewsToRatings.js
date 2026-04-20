import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/database.js";

dotenv.config({ path: ".env" });

const migrateReviewsToRatings = async () => {
  try {
    await connectDB();

    const db = mongoose.connection.db;
    const source = db.collection("reviews");
    const target = db.collection("ratings");

    const existingCount = await source.countDocuments();
    if (existingCount === 0) {
      console.log(
        "No documents found in reviews collection. Nothing to migrate.",
      );
      process.exit(0);
    }

    const docs = await source.find({}).toArray();

    let inserted = 0;
    let updated = 0;

    for (const doc of docs) {
      const { _id, ...rest } = doc;
      const result = await target.updateOne(
        { _id },
        { $set: rest, $setOnInsert: { _id } },
        { upsert: true },
      );

      if (result.upsertedCount > 0) {
        inserted += 1;
      } else if (result.matchedCount > 0) {
        updated += 1;
      }
    }

    console.log(
      `Migration complete. Inserted: ${inserted}, Updated: ${updated}`,
    );
    console.log("Collection used by app is now ratings.");

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  }
};

migrateReviewsToRatings();
