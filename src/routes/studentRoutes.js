import express from "express";

import {
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  patchStudent,
} from "../controllers/studentController.js";

import { getMyStudent } from "../controllers/studentProfileController.js";

import { validate } from "../middleware/validate.js";

import {
  createStudentSchema,
  studentIdSchema,
  updateStudentSchema,
  patchStudentSchema,
  paginationSchema,
} from "../validations/studentValidation.js";

import { verifytoken } from "../middleware/validatetoken.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.get(
  "/",
  verifytoken,
  authorize("admin", "staff"),
  validate(paginationSchema, "query"),
  getStudent,
);
router.post(
  "/",
  verifytoken,
  authorize("admin", "staff"),
  validate(createStudentSchema, "body"),
  createStudent,
);

router.put(
  "/:id",
  verifytoken,
  authorize("admin", "staff"),
  validate(studentIdSchema, "params"),
  validate(updateStudentSchema, "body"),
  updateStudent,
);

router.delete(
  "/:id",
  verifytoken,
  authorize("admin"),
  validate(studentIdSchema, "params"),
  deleteStudent,
);

router.patch(
  "/:id",
  verifytoken,
  authorize("admin", "staff"),
  validate(studentIdSchema, "params"),
  validate(patchStudentSchema, "body"),
  patchStudent,
);



//student Routes

router.get("/me", verifytoken, authorize("student"), getMyStudent);

export default router;
