import { STATUS_CODES } from "../constants/statusCodes.js";

import { getMyStudentService } from "../services/studentprofileService.js";


export const getMyStudent = async (req, res, next) => {
  try {
    const student = await getMyStudentService({
      userId: req.user.id,
    });

    return res
      .status(STATUS_CODES.OK)
      .json(student);

  } catch (error) {
    next(error);
  }
};