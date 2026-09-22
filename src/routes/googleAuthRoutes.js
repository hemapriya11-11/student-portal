import express from "express";
import passport from "../config/passport.js";
import { googleAuthCallback } from "../controllers/googleAuthController.js";

const router = express.Router();

router.get(
"/google",
passport.authenticate("google", {
scope: ["profile", "email"],
})
);

router.get(
"/google/callback",
passport.authenticate("google", {
session: false,
}),
googleAuthCallback
);

export default router;
