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

/**
 * @swagger
 * /admin/students/me:
 *   get:
 *     summary: Get current student's profile
 *     description: Returns the profile of the currently authenticated student.
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile retrieved successfully
 *       401:
 *         description: Token required or invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: Student not found
 */
router.get(
  "/me",
  authorize("student"),
  mustChangePassword,
  getMyStudent,
);

/**
 * @swagger
 * /admin/students/new:
 *   post:
 *     summary: Create a new student
 *     description: Creates a new student account. Only administrators can access this endpoint.
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - date_of_birth
 *               - admission_year
 *               - department
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: 2004-05-15
 *               admission_year:
 *                 type: integer
 *                 example: 2026
 *               department:
 *                 type: string
 *                 example: CSE
 *
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student created successfully
 *                 id:
 *                   type: integer
 *                   example: 15
 *                 student_id:
 *                   type: string
 *                   example: 2026CSE001
 *
 *       400:
 *         description: Validation error
 *       401:
 *         description: Token required or invalid token
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Email already exists
 */
router.post(
  "/new",
  authorize("admin"),
  validate(createStudentSchema, "body"),
  createStudent,
);

/**
 * @swagger
 * /admin/students/all:
 *   get:
 *     summary: Get all students
 *     description: Returns a paginated list of students with optional filtering.
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filter by student database ID
 *
 *       - in: query
 *         name: student_id
 *         schema:
 *           type: string
 *         description: Filter by student ID
 *
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Filter by student name
 *
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         description: Filter by email
 *
 *       - in: query
 *         name: admission_year
 *         schema:
 *           type: integer
 *         description: Filter by admission year
 *
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of students per page
 *
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Token required or invalid token
 *       403:
 *         description: Admin access required
 */
router.get(
  "/all",
  authorize("admin"),
  validate(getStudentQuerySchema, "query"),
  getStudent,
);

/**
 * @swagger
 * /admin/students/update/{id}:
 *   put:
 *     summary: Update a student
 *     description: Replaces all editable student information.
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student database ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - date_of_birth
 *               - admission_year
 *               - department
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: 2004-05-15
 *               admission_year:
 *                 type: integer
 *                 example: 2026
 *               department:
 *                 type: string
 *                 example: CSE
 *
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Token required or invalid token
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Student not found
 *       409:
 *         description: Email already exists
 */
router.put(
  "/update/:id",
  authorize("admin"),
  validate(updateStudentSchema, "body"),
  updateStudent,
);

/**
 * @swagger
 * /admin/students/patch/{id}:
 *   patch:
 *     summary: Partially update a student
 *     description: Updates one or more student fields.
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student database ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: 2004-05-15
 *               admission_year:
 *                 type: integer
 *                 example: 2026
 *               department:
 *                 type: string
 *                 example: CSE
 *
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Token required or invalid token
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Student not found
 *       409:
 *         description: Email already exists
 */
router.patch(
  "/patch/:id",
  authorize("admin"),
  validate(patchStudentSchema, "body"),
  patchStudent,
);

/**
 * @swagger
 * /admin/students/delete/{id}:
 *   delete:
 *     summary: Delete a student
 *     description: Deletes a student by database ID.
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student database ID
 *
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       401:
 *         description: Token required or invalid token
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Student not found
 */
router.delete(
  "/delete/:id",
  authorize("admin"),
  deleteStudent,
);

export default router;