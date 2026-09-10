
import dotenv from "dotenv";
import http from "http";
import http from "http";

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

    console.log("Database connected");

    await connectRedis();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
  }
};

<<<<<<< HEAD
startServer();
=======
startServer();