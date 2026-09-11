import express from "express";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} from "../controllers/notificationController.js";

import { verifytoken } from "../middleware/validatetoken.js";

const router = express.Router();

router.get("/", verifytoken, getNotifications);

router.get("/unread-count", verifytoken, getUnreadCount);

router.patch("/read-all", verifytoken, markAllAsRead);

router.patch("/:id/read", verifytoken, markAsRead);

export default router;
