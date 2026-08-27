import bcrypt from "bcrypt";

import User from "../models/user.js";

import { generatetoken } from "../utils/generatetoken.js";

import { STATUS_CODES } from "../constants/statusCodes.js";

import { MESSAGES } from "../constants/messages.js";

import { sendResetEmail } from "../utils/sendEmail.js";

import { AppError } from "../utils/appError.js";
 
import redisClient from "../config/redis.js";

export const signupService = async ({ user_name, email, password }) => {
  const existingUser = await User.findOne({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new AppError(
      MESSAGES.USER_ALREADY_EXISTS,
      STATUS_CODES.BAD_REQUEST
    );
  }

  const hashedPass = await bcrypt.hash(password, 10);

  await User.create({
    user_name,
    email,
    password: hashedPass,
  });
};


export const loginService = async ({ email, password }) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(
      MESSAGES.REGISTER_FIRST,
      STATUS_CODES.BAD_REQUEST
    );
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    throw new AppError(
      MESSAGES.INVALID_CREDENTIALS,
      STATUS_CODES.UNAUTHORIZED
    );
  }

  const accessToken = generatetoken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    "15m",
    process.env.ACCESS_TOKEN_SECRET
  );

  const refreshToken = generatetoken(
    {
      id: user.id,
    },
    "7d",
    process.env.REFRESH_TOKEN_SECRET
  );

  return {
    accessToken,
    refreshToken,
  };
};


export const forgotPasswordService = async ({ email }) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(
      MESSAGES.USER_NOT_FOUND,
      STATUS_CODES.NOT_FOUND
    );
  }

  const token = generatetoken(
    {
      email: user.email,
    },
    "15m"
  );

  const expiry = new Date(
    Date.now() + 15 * 60 * 1000
  );

  await User.update(
    {
      reset_token: token,
      reset_token_expiry: expiry,
    },
    {
      where: {
        id: user.id,
      },
    }
  );

  await sendResetEmail(user.email, token);
};


export const resetPasswordService = async ({ password, userId }) => {
  const hashedPass = await bcrypt.hash(password, 10);

  await User.update(
    {
      password: hashedPass,
      reset_token: null,
      reset_token_expiry: null,
    },
    {
      where: {
        id: userId,
      },
    }
  );
};

export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError(
      "Refresh token not found",
      STATUS_CODES.UNAUTHORIZED
    );
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new AppError(
        MESSAGES.USER_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }

    const accessToken = generatetoken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      "15m",
      process.env.ACCESS_TOKEN_SECRET
    );

    return accessToken;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Invalid or expired refresh token",
      STATUS_CODES.UNAUTHORIZED
    );
  }
};
export const logoutService = async (user) => {
  const { jti, exp } = user;

  const currentTime = Math.floor(Date.now() / 1000);

  const remainingTime = exp - currentTime;

  if (remainingTime > 0) {
    await redisClient.set(
      `blacklist:${jti}`,
      "true",
      {
        EX: remainingTime,
      }
    );
  }
};