import { Op } from "sequelize";
import bcrypt from "bcrypt";

import Student from "../models/student.js";
import redisClient from "../config/redis.js";

import { STATUS_CODES } from "../constants/statusCodes.js";
import { MESSAGES } from "../constants/messages.js";
import { AppError } from "../utils/appError.js";

import { generateStudentId } from "../utils/generateStudentId.js";

const clearStudentCache = async () => {
  const keys = [];

  for await (const batch of redisClient.scanIterator({
    MATCH: "students:*",
  })) {
    keys.push(...batch);
  }

  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};
export const createStudentService = async ({
  name,
  email,
  date_of_birth,
  admission_year,
  department,
}) => {
  try {
    const normalizedDepartment = department.toUpperCase();

    const studentId = await generateStudentId(
      admission_year,
      normalizedDepartment,
    );

    const temporaryPassword = new Date(date_of_birth)
      .toISOString()
      .split("T")[0]
      .replaceAll("-", "");

    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const student = await Student.create({
      student_id: studentId,
      name,
      email,
      password: hashedPassword,
      date_of_birth,
      admission_year,
      department: normalizedDepartment,
      must_change_password: true,
    });

    await clearStudentCache();

    return student;
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new AppError(MESSAGES.EMAIL_ALREADY_EXISTS, STATUS_CODES.CONFLICT);
    }

    throw error;
  }
};

export const getStudentService = async ({
  id,
  student_id,
  name,
  email,
  admission_year,
  department,
  page = 1,
  limit = 10,
}) => {
  const normalizedDepartment = department?.toUpperCase();

  const query = {
    id,
    student_id,
    name,
    email,
    admission_year,
    department: normalizedDepartment,
    page,
    limit,
  };

  const cacheKey = `students:${JSON.stringify(query)}`;

  const cachedStudents = await redisClient.get(cacheKey);

  if (cachedStudents) {
    console.log("CACHE HIT");

    return JSON.parse(cachedStudents);
  }

  console.log("CACHE MISS");

  const where = {};

  if (id) {
    where.id = id;
  }

  if (student_id) {
    where.student_id = student_id;
  }

  if (name) {
    where.name = {
      [Op.like]: `%${name}%`,
    };
  }

  if (email) {
    where.email = email;
  }

  if (admission_year) {
    where.admission_year = Number(admission_year);
  }

  if (normalizedDepartment) {
    where.department = {
      [Op.like]: `%${normalizedDepartment}%`,
    };
  }

  const offset = (Number(page) - 1) * Number(limit);

  const students = await Student.findAll({
    where,
    attributes: {
      exclude: ["password"],
    },
    limit: Number(limit),
    offset,
    order: [["id", "ASC"]],
  });

  const response = {
    page: Number(page),
    limit: Number(limit),
    students,
  };

  await redisClient.set(cacheKey, JSON.stringify(response), {
    EX: 60,
  });

  return response;
};

export const updateStudentService = async ({
  id,
  name,
  email,
  date_of_birth,
  admission_year,
  department,
}) => {
  try {
    const [updatedRows] = await Student.update(
      {
        name,
        email,
        date_of_birth,
        admission_year,
        department: department.toUpperCase(),
      },
      {
        where: {
          id,
        },
      },
    );

    if (updatedRows === 0) {
      throw new AppError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    await clearStudentCache();
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new AppError(MESSAGES.EMAIL_ALREADY_EXISTS, STATUS_CODES.CONFLICT);
    }

    throw error;
  }
};

export const patchStudentService = async ({
  id,
  name,
  email,
  date_of_birth,
  admission_year,
  department,
}) => {
  try {
    const updates = {};

    if (name !== undefined) {
      updates.name = name;
    }

    if (email !== undefined) {
      updates.email = email;
    }

    if (date_of_birth !== undefined) {
      updates.date_of_birth = date_of_birth;
    }

    if (admission_year !== undefined) {
      updates.admission_year = admission_year;
    }

    if (department !== undefined) {
      updates.department = department.toUpperCase();
    }

    const [updatedRows] = await Student.update(updates, {
      where: {
        id,
      },
    });

    if (updatedRows === 0) {
      throw new AppError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    await clearStudentCache();
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new AppError(MESSAGES.EMAIL_ALREADY_EXISTS, STATUS_CODES.CONFLICT);
    }

    throw error;
  }
};

export const deleteStudentService = async ({ id }) => {
  const deletedRows = await Student.destroy({
    where: {
      id,
    },
  });

  if (deletedRows === 0) {
    throw new AppError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }

  await clearStudentCache();
};
