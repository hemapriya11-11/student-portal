import dotenv from "dotenv";

import app from "./app.js";
import sequelize from "./config/sequelize.js";
import { connectRedis } from "./config/redis.js";

dotenv.config();

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connected");

    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
  }
};

startServer();
