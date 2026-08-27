import Jwt from "jsonwebtoken";

import { MESSAGES } from "../constants/messages.js";

import { STATUS_CODES } from "../constants/statusCodes.js";
import redisClient from "../config/redis.js";

export const verifytoken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(STATUS_CODES.UNAUTHORIZED).send(MESSAGES.TOKEN_REQUIRED);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send(MESSAGES.INVALID_TOKEN_FORMAT);
  }

  try {
    const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const isBlacklisted = await redisClient.get(`blacklist:${decoded.jti}`);

    if (isBlacklisted) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send("Token has been invalidated");
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send(MESSAGES.INVALID_OR_EXPIRED_TOKEN);
  }
};
