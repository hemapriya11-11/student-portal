import Jwt from "jsonwebtoken";

import redisClient from "../config/redis.js";


export const socketAuth = async (
  socket,
  next,
) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(
        new Error("Authentication token required"),
      );
    }

    const decoded = Jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    );

    const isBlacklisted = await redisClient.get(
      `blacklist:${decoded.jti}`,
    );

    if (isBlacklisted) {
      return next(
        new Error("Token has been invalidated"),
      );
    }

    socket.user = decoded;

    next();
  } catch (error) {
    next(
      new Error("Invalid or expired token"),
    );
  }
};