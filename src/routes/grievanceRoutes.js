import express from "express";

import {
  createGrievanceController,
  getMyGrievancesController,
  getAllGrievancesController,
  getGrievanceByIdController,
  updateGrievanceStatusController,
  assignGrievanceController,
  updateGrievancePriorityController,
} from "../controllers/grievanceController.js";

import { verifytoken } from "../middleware/validatetoken.js";
import { authorize } from "../middleware/authorize.js";

import { validate } from "../middleware/validate.js";

import {
  createGrievanceSchema,
  updateGrievanceStatusSchema,
  assignGrievanceSchema,
  updateGrievancePrioritySchema,
} from "../validations/grievanceValidation.js";

const router = express.Router();


router.post(
  "/mygrieve",
  verifytoken,
  authorize("student"),
  validate(createGrievanceSchema, "body"),
  createGrievanceController,
);


router.get(
  "/my",
  verifytoken,
  authorize("student"),
  getMyGrievancesController,
);


router.get(
  "/",
  verifytoken,
  authorize("staff", "admin"),
  getAllGrievancesController,
);


router.get(
  "/:id",
  verifytoken,
  getGrievanceByIdController,
);


router.patch(
  "/:id/status",
  verifytoken,
  authorize("staff", "admin"),
  validate(updateGrievanceStatusSchema, "body"),
  updateGrievanceStatusController,
);


router.patch(
  "/:id/assign",
  verifytoken,
  authorize("admin"),
  validate(assignGrievanceSchema, "body"),
  assignGrievanceController,
);


router.patch(
  "/:id/priority",
  verifytoken,
  authorize("staff", "admin"),
  validate(updateGrievancePrioritySchema, "body"),
  updateGrievancePriorityController,
);


export default router;