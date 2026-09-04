
import redisClient from "../config/redis.js";

export const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;

    const key = `rate-limit:${ip}`;

    const requests = await redisClient.incr(key);

    if (requests === 1) {
      await redisClient.expire(key, 60);
    }

    if (requests > 5) {
      return res
        .status(STATUS_CODES.TOO_MANY_REQUESTS)
        .send("Too many requests. Please try again later.");
    }

    next();
  } catch (error) {
    next(error);
  }
};