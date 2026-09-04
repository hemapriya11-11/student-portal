import express from "express";

import {
createStudent,
getStudent,
updateStudent,
patchStudent,
deleteStudent,
} from "../controllers/studentController.js";

import { getMyStudent } from "../controllers/studentProfileController.js";

import {
createStudentSchema,
updateStudentSchema,
patchStudentSchema,
getStudentQuerySchema,
} from "../validations/studentValidation.js";

import { validate } from "../middleware/validate.js";
import { verifytoken } from "../middleware/validatetoken.js";
import { authorize } from "../middleware/authorize.js";
import { mustChangePassword } from "../middleware/mustChangePassword.js";

const router = express.Router();

router.use(verifytoken);



router.get(
  "/me",
  authorize("student"),
  mustChangePassword,
  getMyStudent,
);

router.post(
  "/new",
  authorize("admin"),
  validate(createStudentSchema, "body"),
  createStudent,
);

router.get(
  "/",
  authorize("admin"),
  validate(getStudentQuerySchema, "query"),
  getStudent,
);

router.put(
  "/update/:id",
  authorize("admin"),
  validate(updateStudentSchema, "body"),
  updateStudent,
);

router.patch(
  "/patch/:id",
  authorize("admin"),
  validate(patchStudentSchema, "body"),
  patchStudent,
);

router.delete(
  "/delete/:id",
  authorize("admin"),
  deleteStudent,
);

export default router;