import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./config/database.js";

dotenv.config();

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(
      `✓ Client running on ${process.env.CLIENT_URL || "http://localhost:5173"}`,
    );
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
