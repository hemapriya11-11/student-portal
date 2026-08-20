import { pool } from "../config/db.js";
import { Student } from "../models/studentModel.js";

export const createStudent = async (req, res) => {
  try {
    const { name, personal_email, age, department } = req.body;

    const student = await Student.create({
      name,
      personal_email,
      age,
      department,
    });

    return res.status(201).json({
      message: "Student created successfully",
      studentId: student.id,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to create student",
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

    return res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      students,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch students",
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
        where: {
          id,
        },
      },
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.status(200).json({
      message: `Student with ID ${id} updated successfully`,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to update student",
    });
  }
};

export const patchStudent = async (req, res) => {
  try {
    const { id } = req.params;

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
        id,
      },
    });

    if (updatedRows === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.status(200).json({
      message: "Student updated successfully",
    });
  } catch (error) {
    console.error(error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to update student",
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRows = await Student.destroy({
      where: {
        id,
      },
    });

    if (deletedRows === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete student",
    });
  }
};
