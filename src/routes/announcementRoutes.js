import express from "express";

import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  patchAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  patchAnnouncementSchema,
} from "../validations/announcement.js";

import { validate } from "../middleware/validate.js";
import { verifytoken } from "../middleware/validatetoken.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.use(verifytoken);

router.post(
  "/",
  authorize("admin", "staff"),
  validate(createAnnouncementSchema, "body"),
  createAnnouncement,
);

router.get(
  "/",
  authorize("admin", "staff", "student"),
  getAnnouncements,
);

router.get(
  "/:id",
  authorize("admin", "staff", "student"),
  getAnnouncementById,
);

router.put(
  "/:id",
  authorize("admin"),
  validate(updateAnnouncementSchema, "body"),
  updateAnnouncement,
);

router.patch(
  "/:id",
  authorize("admin"),
  validate(patchAnnouncementSchema, "body"),
  patchAnnouncement,
);

router.delete(
  "/:id",
  authorize("admin"),
  deleteAnnouncement,
);

export default router;