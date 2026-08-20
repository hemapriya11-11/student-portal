import express from "express";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/authJoi.js";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { verifyResetToken } from "../middleware/verifyresettoken.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();


router.post("/signup", validate(signupSchema,"body"), signup);
router.post("/login", validate(loginSchema,"body"), login);
router.post("/forgotpassword", validate(forgotPasswordSchema,"body"), forgotPassword);
router.post("/resetpassword/:token", verifyResetToken,validate(resetPasswordSchema,"body"),resetPassword);
export default router;
