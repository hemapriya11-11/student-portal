
import { Server } from "socket.io";
import Jwt from "jsonwebtoken";
import redisClient from "./redis.js";

let io;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication token required"));
      }

      const decoded = Jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
      );

      const isBlacklisted = await redisClient.get(
        `blacklist:${decoded.jti}`,
      );

      if (isBlacklisted) {
        return next(new Error("Token has been invalidated"));
      }

      socket.user = decoded;

      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const { role } = socket.user;

    socket.join(role);

    console.log(
      `WebSocket connected: ${socket.id} (${role})`,
    );

    socket.on("disconnect", () => {
      console.log(
        `WebSocket disconnected: ${socket.id}`,
      );
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};

