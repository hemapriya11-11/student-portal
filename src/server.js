
import dotenv from "dotenv";
import http from "http";
import logger from "./utils/logger.js"
import app from "./app.js";
import sequelize from "./config/sequelize.js";
import { connectRedis } from "./config/redis.js";
import { initializeSocket } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT;

const server = http.createServer(app);

initializeSocket(server);

const startServer = async () => {
  try {
    await sequelize.authenticate();

    logger.info("Database connected");

    await connectRedis();

    server.listen(PORT, () => {
     logger.info(
      {port:PORT},
      "Server Running"
     )
    });
  } catch (error) {
   logger.error(
    {err:error},
    "failed to connect database"
   )
  }
};

startServer();
