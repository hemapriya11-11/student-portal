import dotenv from "dotenv";
import app from "./app.js";
import sequelize from "./config/sequelize.js";
import { connectRedis } from "./config/redis.js";

dotenv.config();

const PORT = process.env.PORT;

try {
  await sequelize.authenticate();

  console.log("Sequelize connected");

  await sequelize.sync();

  console.log("Sequelize models synced");

  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

} catch (error) {
  console.error("Server startup failed:", error);
}