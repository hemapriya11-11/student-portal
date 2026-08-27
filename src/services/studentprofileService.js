import { MESSAGES } from "../constants/messages.js";

import { STATUS_CODES } from "../constants/statusCodes.js";

import { AppError } from "../utils/appError.js";

import Student from "../models/student.js";


export const getMyStudentService = async ({ userId }) => {
  const student = await Student.findOne({
    where: {
      user_id: userId,
    },
  });

  if (!student) {
    throw new AppError(
      MESSAGES.STUDENT_NOT_FOUND,
      STATUS_CODES.NOT_FOUND
    );
  }

  return student;
};