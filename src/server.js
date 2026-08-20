import dotenv from "dotenv";
import app from "./app.js";
import { pool } from "./config/db.js";
import {sequelize} from "./config/sequelize.js";
import "./models/User.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

try {
  await pool.query("SELECT 1");
  console.log("MySQL connected");

  await sequelize.authenticate();
  console.log("Sequelize connected");

  await sequelize.sync();
  console.log("Sequelize models synced");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Database connection failed:", error);
}