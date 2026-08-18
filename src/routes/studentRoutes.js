import express from "express";
import { createStudent,getStudent,getStudentById ,updateStudent,deleteStudent,patchStudent} from "../controllers/studentController.js";

const router = express.Router();

router.post("/", createStudent);
router.get("/studentslist",getStudent)
router.get("/:id", getStudentById)
router.put("/:id",updateStudent)
router.delete("/:id",deleteStudent)
router.patch("/:id",patchStudent)
export default router;