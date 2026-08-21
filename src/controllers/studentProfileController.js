import { MESSAGES } from "../constants/messages.js";

import { STATUS_CODES } from "../constants/statusCodes.js";

import Student from "../models/student.js";

export const createMyStudent = async (req, res) => {

  try {

    const { name, personal_email, age, department } = req.body;

    const existingStudent = await Student.findOne({

      where: {

        user_id: req.user.id,

      },

    });

    if (existingStudent) {

      return res.status(STATUS_CODES.CONFLICT).json(MESSAGES.EMAIL_ALREADY_EXISTS);

    }

    const student = await Student.create({

      user_id: req.user.id,

      name,

      personal_email,

      age,

      department,

    });

    return res.status(STATUS_CODES.CREATED).json({

      message: MESSAGES.STUDENT_CREATED,

      studentId: student.id,

    });

  } catch (error) {

    console.error(error);

    if (error.name === "SequelizeUniqueConstraintError") {

      return res.status(STATUS_CODES.CONFLICT).json({

        message: MESSAGES.EMAIL_ALREADY_EXISTS,

      });

    }

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({

      message: MESSAGES.SOMETHING_WENT_WRONG,

    });

  }

};



export const getMyStudent = async (req, res) => {

  try {

    const student = await Student.findOne({

      where: {

        user_id: req.user.id,

      },

    });

    if (!student) {

      return res.status(STATUS_CODES.NOT_FOUND).json({

        message: MESSAGES.STUDENT_NOT_FOUND,

      });

    }

    return res.status(STATUS_CODES.OK).json(student);

  } catch (error) {

    console.error(error);

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({

      message: MESSAGES.SOMETHING_WENT_WRONG,

    });

  }

};



export const updateMyStudent = async (req, res) => {

  try {

    const { name, personal_email, age, department } = req.body;

    const [updatedRows] = await Student.update(

      {

        name,

        personal_email,

        age,

        department,

      },

      {

        where: {

          user_id: req.user.id,

        },

      }

    );

    if (updatedRows === 0) {

      return res.status(STATUS_CODES.NOT_FOUND).json({

        message: MESSAGES.STUDENT_NOT_FOUND,

      });

    }

    return res.status(STATUS_CODES.OK).json({

      message: MESSAGES.STUDENT_UPDATED,

    });

  } catch (error) {

    console.error(error);

    if (error.name === "SequelizeUniqueConstraintError") {

      return res.status(STATUS_CODES.CONFLICT).json({

        message: MESSAGES.EMAIL_ALREADY_EXISTS,

      });

    }

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({

      message: MESSAGES.SOMETHING_WENT_WRONG,

    });

  }

};



export const patchMyStudent = async (req, res) => {

  try {

    const { name, personal_email, age, department } = req.body;

    const updates = {};

    if (name !== undefined) {

      updates.name = name;

    }

    if (personal_email !== undefined) {

      updates.personal_email = personal_email;

    }

    if (age !== undefined) {

      updates.age = age;

    }

    if (department !== undefined) {

      updates.department = department;

    }

    const [updatedRows] = await Student.update(updates, {

      where: {

        user_id: req.user.id,

      },

    });

    if (updatedRows === 0) {

      return res.status(STATUS_CODES.NOT_FOUND).json({

        message: MESSAGES.STUDENT_NOT_FOUND,

      });

    }

    return res.status(STATUS_CODES.OK).json({

      message: MESSAGES.STUDENT_UPDATED,

    });

  } catch (error) {

    console.error(error);

    if (error.name === "SequelizeUniqueConstraintError") {

      return res.status(STATUS_CODES.CONFLICT).json({

        message: MESSAGES.EMAIL_ALREADY_EXISTS,

      });

    }

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({

      message: MESSAGES.SOMETHING_WENT_WRONG,

    });

  }

};