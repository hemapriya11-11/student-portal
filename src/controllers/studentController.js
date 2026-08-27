import {
  createStudentService,
  getStudentService,
  updateStudentService,
  patchStudentService,
  deleteStudentService,
} from "../services/studentService.js";

import { STATUS_CODES } from "../constants/statusCodes.js";

import { MESSAGES } from "../constants/messages.js";

export const createStudent = async (req, res, next) => {
  try {
    const student = await createStudentService({
      userId: req.user.id,
      ...req.body,
    });

    return res
      .status(STATUS_CODES.CREATED)
      .json({
        message: MESSAGES.STUDENT_CREATED,
        studentId: student.id,
      });
  } catch (error) {
    next(error);
  }
};

export const getStudent = async (req, res, next) => {
  try {
    const students = await getStudentService(
      req.query
    );

    return res
      .status(STATUS_CODES.OK)
      .json(students);
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    await updateStudentService({
      id: req.params.id,
      ...req.body,
    });

    return res
      .status(STATUS_CODES.OK)
      .json({
        message: MESSAGES.STUDENT_UPDATED,
      });
  } catch (error) {
    next(error);
  }
};


export const patchStudent = async (req, res, next) => {
  try {
    await patchStudentService({
      id: req.params.id,
      ...req.body,
    });

    return res
      .status(STATUS_CODES.OK)
      .json(MESSAGES.STUDENT_UPDATED);
  } catch (error) {
    next(error);
  }
};


export const deleteStudent = async (req, res, next) => {
  try {
    await deleteStudentService({
      id: req.params.id,
    });

    return res
      .status(STATUS_CODES.OK)
      .json(MESSAGES.STUDENT_DELETED);
  } catch (error) {
    next(error);
  }
};