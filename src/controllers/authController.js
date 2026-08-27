import {
  signupService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
  refreshTokenService,
  logoutService,
} from "../services/authService.js";
import dotenv from "dotenv"

import { STATUS_CODES } from "../constants/statusCodes.js";
import { MESSAGES } from "../constants/messages.js";
dotenv.config();


export const signup = async (req, res, next) => {
  try {
    await signupService(req.body);

    return res
      .status(STATUS_CODES.CREATED)
      .send(MESSAGES.USER_CREATED);

  } catch (error) {
    next(error);
  }
};


export const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } =
      await loginService(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(STATUS_CODES.OK)
      .json({
        msg: MESSAGES.LOGIN_SUCCESS,
        token: accessToken,
      });

  } catch (error) {
    next(error);
  }
};


export const forgotPassword = async (req, res, next) => {
  try {
    await forgotPasswordService(req.body);

    return res
      .status(STATUS_CODES.OK)
      .send("Password reset link sent to your email");

  } catch (error) {
    next(error);
  }
};


export const resetPassword = async (req, res, next) => {
  try {
    await resetPasswordService({
      password: req.body.password,
      userId: req.user.id,
    });

    return res
      .status(STATUS_CODES.OK)
      .send(MESSAGES.PASSWORD_RESET_SUCCESS);

  } catch (error) {
    next(error);
  }
};
export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const accessToken = await refreshTokenService(refreshToken);

    return res.status(STATUS_CODES.OK).json({
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};



export const logout = async (req, res, next) => {
  try {
    await logoutService(req.user);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res
      .status(STATUS_CODES.OK)
      .send("Logout successful");

  } catch (error) {
    next(error);
  }
};
