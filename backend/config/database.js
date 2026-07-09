import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/FoodHub";

    if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
      console.warn(
        "MONGO_URI is not set. Falling back to mongodb://127.0.0.1:27017/FoodHub for local development.",
      );
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`Γ£ô MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Γ£ù MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
