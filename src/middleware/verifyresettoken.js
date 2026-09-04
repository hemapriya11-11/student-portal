import jwt from "jsonwebtoken";

import redisClient from "../config/redis.js";

import { STATUS_CODES } from "../constants/statusCodes.js";
import { MESSAGES } from "../constants/messages.js";

export const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(
      token,
      process.env.RESET_TOKEN_SECRET,
    );

    if (decoded.type !== "password_reset") {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send(MESSAGES.INVALID_OR_EXPIRED_TOKEN);
    }

    const resetSession = await redisClient.get(
      `password-reset:${decoded.jti}`,
    );

    if (!resetSession) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send(MESSAGES.INVALID_OR_EXPIRED_TOKEN);
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
      jti: decoded.jti,
    };

    next();
  } catch (error) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send(MESSAGES.INVALID_OR_EXPIRED_TOKEN);
  }
};