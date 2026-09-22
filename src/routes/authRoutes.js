import express from "express";

import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../validations/authJoi.js";

import {
  login,
  forgotPassword,
  changePassword,
  resetPassword,
  refreshToken,
  logout,
} from "../controllers/authController.js";

import { verifyResetToken } from "../middleware/verifyresettoken.js";
import { validate } from "../middleware/validate.js";
import { verifytoken } from "../middleware/validatetoken.js";
import { rateLimiter } from "../middleware/ratelimiter.js";

const router = express.Router();

router.post(
  "/login",
  rateLimiter,
  validate(loginSchema, "body"),
  login,
);

router.post(
  "/forgotpassword",
  rateLimiter,
  validate(forgotPasswordSchema, "body"),
  forgotPassword,
);

router.post(
  "/change-password",
  verifytoken,
  validate(changePasswordSchema, "body"),
  changePassword,
);

router.post(
  "/resetpassword/:token",
  rateLimiter,
  verifyResetToken,
  validate(resetPasswordSchema, "body"),
  resetPassword,
);

router.post("/refresh-token", refreshToken);

router.post("/logout", verifytoken, logout);

export default router;