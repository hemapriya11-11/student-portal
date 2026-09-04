import Student from "../models/student.js";

import { STATUS_CODES } from "../constants/statusCodes.js";
import { MESSAGES } from "../constants/messages.js";

export const mustChangePassword = async (
  req,
  res,
  next,
) => {
  try {
    if (req.user.role !== "student") {
      return next();
    }

    const student = await Student.findByPk(
      req.user.id,
      {
        attributes: [
          "id",
          "must_change_password",
        ],
      },
    );

    if (!student) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send(MESSAGES.STUDENT_NOT_FOUND);
    }

    if (student.must_change_password) {
      return res
        .status(STATUS_CODES.FORBIDDEN)
        .send(
          "You must change your password before accessing this resource",
        );
    }

    next();
  } catch (error) {
    next(error);
  }
};