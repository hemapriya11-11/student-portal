import express from "express";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../middleware/authJoi.js";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { verifyResetToken } from "../middleware/verifyresettoken.js";
import { validateId } from "../middleware/validateId.js";

const router = express.Router();


router.post("/signup", validateId(signupSchema), signup);
router.post("/login", validateId(loginSchema), login);
router.post("/forgotpassword", validateId(forgotPasswordSchema), forgotPassword);
router.post("/resetpassword/:token", verifyResetToken,validateId(resetPasswordSchema),resetPassword);
export default router;
