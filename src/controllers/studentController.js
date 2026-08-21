import { Op } from "sequelize";

import Student from "../models/student.js";

import { STATUS_CODES } from "../constants/statusCodes.js";

import { MESSAGES } from "../constants/messages.js";

export const createStudent = async (req, res) => {

  try {

    const { name, personal_email, age, department } = req.body;

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

export const getStudent = async (req, res) => {

  try {

    const {

      id,

      name,

      age,

      department,

      personal_email,

      page = 1,

      limit = 10,

    } = req.query;

    const where = {};

    if (id) {

      where.id = id;

    }

    if (name) {

      where.name = {

        [Op.like]: `%${name}%`,

      };

    }

    if (age) {

      where.age = age;

    }

    if (department) {

      where.department = {

        [Op.like]: `%${department}%`,

      };

    }

    if (personal_email) {

      where.personal_email = personal_email;

    }

    const offset = (Number(page) - 1) * Number(limit);

    const students = await Student.findAll({

      where,

      limit: Number(limit),

      offset,

    });

    return res.status(STATUS_CODES.OK).json({

      page: Number(page),

      limit: Number(limit),

      students,

    });

  } catch (error) {

    console.error(error);

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({

      message: MESSAGES.SOMETHING_WENT_WRONG,

    });

  }

};

export const updateStudent = async (req, res) => {

  try {

    const { id } = req.params;

    const { name, personal_email, age, department } = req.body;

    const [updatedRows] = await Student.update(

      {

        name,

        personal_email,

        age,

        department,

      },

      {

        where: { id },

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

export const patchStudent = async (req, res) => {

  try {

    const { id } = req.params;

    const { name, personal_email, age, department } = req.body;

    const updates = {};

    if (name !== undefined) updates.name = name;

    if (personal_email !== undefined) updates.personal_email = personal_email;

    if (age !== undefined) updates.age = age;

    if (department !== undefined) updates.department = department;

    const [updatedRows] = await Student.update(updates, {

      where: { id },

    });

    if (updatedRows === 0) {

      return res.status(STATUS_CODES.NOT_FOUND).json(

        MESSAGES.STUDENT_NOT_FOUND

      );

    }

    return res.status(STATUS_CODES.OK).json(MESSAGES.STUDENT_UPDATED

    );

  } catch (error) {

    console.error(error);

    if (error.name === "SequelizeUniqueConstraintError") {

      return res.status(STATUS_CODES.CONFLICT).json(MESSAGES.EMAIL_ALREADY_EXISTS);

    }

    return res.status(STATUS_CODES.BAD_REQUEST).json(MESSAGES.SOMETHING_WENT_WRONG);

  }

};

export const deleteStudent = async (req, res) => {

  try {

    const { id } = req.params;

    const deletedRows = await Student.destroy({

      where: { id },

    });

    if (deletedRows === 0) {

      return res.status(STATUS_CODES.NOT_FOUND).json(MESSAGES.STUDENT_NOT_FOUND);

    }

    return res.status(STATUS_CODES.OK).json(MESSAGES.STUDENT_DELETED);

  } catch (error) {

    console.error(error);

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(MESSAGES.SOMETHING_WENT_WRONG);

  }

};