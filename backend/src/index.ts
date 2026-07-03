import "dotenv/config";
import app from "./app.js";
import { db } from "./lib/db.js";

const PORT = process.env.PORT || 5000;

db.$connect()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });