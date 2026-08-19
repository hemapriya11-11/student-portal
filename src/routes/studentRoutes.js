import express from "express";
import { createStudent,getStudent,getStudentById ,updateStudent,deleteStudent,patchStudent} from "../controllers/studentController.js";
import { validateId } from "../middleware/validateId.js";

const router = express.Router();

router.post("/", createStudent);
router.get("/studentslist",validateId,getStudent)
router.get("/:id",validateId, getStudentById)
router.put("/:id",validateId,updateStudent)
router.delete("/:id",validateId,deleteStudent)
router.patch("/:id",validateId,patchStudent)

export default router;