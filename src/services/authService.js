import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { generatetoken } from "../utils/generatetoken.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { MESSAGES } from "../constants/messages.js";
import { sendResetEmail } from "../utils/sendEmail.js";
import { AppError } from "../utils/appError.js";
import redisClient from "../config/redis.js";

import {
  findAccountByIdentifier,
  findAccountByIdAndRole,
  findAccountByEmail,
} from "./accountService.js";

export const loginService = async ({ identifier, password }) => {
  const result = await findAccountByIdentifier(identifier);

  if (!result) {
    throw new AppError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
  }

  const { account, role } = result;

  const passwordMatch = await bcrypt.compare(password, account.password);

  if (!passwordMatch) {
    throw new AppError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
  }

  const { accessToken, refreshToken } = generateAuthTokens(account, role);

  return {
    accessToken,
    refreshToken,

    mustChangePassword: account.must_change_password ?? false,
  };
};

export const changePasswordService = async ({
  userId,
  role,
  currentPassword,
  newPassword,
}) => {
  const account = await findAccountByIdAndRole(userId, role);

  if (!account) {
    throw new AppError(MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }

  const passwordMatch = await bcrypt.compare(currentPassword, account.password);

  if (!passwordMatch) {
    throw new AppError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  account.password = hashedPassword;

  if (role === "student") {
    account.must_change_password = false;
  }

  await account.save();
};

export const forgotPasswordService = async ({ email }) => {
  const result = await findAccountByEmail(email);

  // Don't reveal whether the email exists
  if (!result) {
    return;
  }

  const { account, role } = result;

  const token = generatetoken(
    {
      id: account.id,
      role,
      type: "password_reset",
    },
    "15m",
    process.env.RESET_TOKEN_SECRET,
  );

  const decoded = jwt.decode(token);

  await redisClient.set(
    `password-reset:${decoded.jti}`,
    JSON.stringify({
      id: account.id,
      role,
    }),
    {
      EX: 15 * 60,
    },
  );

  await sendResetEmail(account.email, token);
};

export const resetPasswordService = async ({ password, userId, role, jti }) => {
  const account = await findAccountByIdAndRole(userId, role);

  if (!account) {
    throw new AppError(MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }

  const hashedPass = await bcrypt.hash(password, 10);

  account.password = hashedPass;

  await account.save();

  await redisClient.del(`password-reset:${jti}`);
};

export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token not found", STATUS_CODES.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const account = await findAccountByIdAndRole(decoded.id, decoded.role);

    if (!account) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    const accessToken = generatetoken(
      {
        id: account.id,
        role: decoded.role,
      },
      "15m",
      process.env.ACCESS_TOKEN_SECRET,
    );

    return accessToken;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Invalid or expired refresh token",
      STATUS_CODES.UNAUTHORIZED,
    );
  }
};

export const logoutService = async (user) => {
  const { jti, exp } = user;

  const currentTime = Math.floor(Date.now() / 1000);

  const remainingTime = exp - currentTime;

  if (remainingTime > 0) {
    await redisClient.set(`blacklist:${jti}`, "true", {
      EX: remainingTime,
    });
  }
};

export const generateAuthTokens = (account, role) => {
  const accessToken = generatetoken(
    {
      id: account.id,
      role,
    },
    "15m",
    process.env.ACCESS_TOKEN_SECRET,
  );

  const refreshToken = generatetoken(
    {
      id: account.id,
      role,
    },
    "7d",
    process.env.REFRESH_TOKEN_SECRET,
  );

  return {
    accessToken,
    refreshToken,
  };
};
