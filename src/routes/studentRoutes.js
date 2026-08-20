import express from "express";
import {
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  patchStudent,
} from "../controllers/studentController.js";
import { validate } from "../middleware/validate.js";
import {
  createStudentSchema,
  studentIdSchema,
  updateStudentSchema,
  patchStudentSchema,
  paginationSchema,
} from "../validations/studentValidation.js";

import { verifytoken } from "../middleware/validatetoken.js";

const router = express.Router();



router.post("/", validate(createStudentSchema, "body"), createStudent);

router.get("/", validate(paginationSchema, "query"), getStudent);

router.put(
  "/:id",
  validate(studentIdSchema, "params"),
  validate(updateStudentSchema, "body"),
  updateStudent,
);

router.delete("/:id", validate(studentIdSchema, "params"), deleteStudent);

router.patch(
  "/:id",
  validate(studentIdSchema, "params"),
  validate(patchStudentSchema, "body"),
  patchStudent,
);

export default router;
