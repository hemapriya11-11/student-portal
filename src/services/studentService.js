import { Op } from "sequelize";

import Student from "../models/student.js";

import redisClient from "../config/redis.js";

import { STATUS_CODES } from "../constants/statusCodes.js";

import { MESSAGES } from "../constants/messages.js";

import { AppError } from "../utils/appError.js";


const clearStudentCache = async () => {
  const keys = [];

  for await (const key of redisClient.scanIterator({
    MATCH: "students:*",
  })) {
    keys.push(key);
  }

  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};

export const createStudentService = async ({
  userId,
  name,
  personal_email,
  age,
  department,
}) => {
  try {
    const student = await Student.create({
      user_id: userId,
      name,
      personal_email,
      age,
      department,
    });

    return student;
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new AppError(
        MESSAGES.EMAIL_ALREADY_EXISTS,
        STATUS_CODES.CONFLICT
      );
    }

    throw error;
  }
};

export const getStudentService = async ({
  id,
  name,
  age,
  department,
  personal_email,
  page = 1,
  limit = 10,
}) => {
  const query = {
    id,
    name,
    age,
    department,
    personal_email,
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

  const offset =
    (Number(page) - 1) * Number(limit);

  const students = await Student.findAll({
    where,
    limit: Number(limit),
    offset,
  });

  const response = {
    page: Number(page),
    limit: Number(limit),
    students,
  };

  await redisClient.set(
    cacheKey,
    JSON.stringify(response),
    {
      EX: 60,
    }
  );

  return response;
};

export const updateStudentService = async ({
  id,
  name,
  personal_email,
  age,
  department,
}) => {
  try {
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
      }
    );

    if (updatedRows === 0) {
      throw new AppError(
        MESSAGES.STUDENT_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }

    await clearStudentCache();
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new AppError(
        MESSAGES.EMAIL_ALREADY_EXISTS,
        STATUS_CODES.CONFLICT
      );
    }

    throw error;
  }
};

export const patchStudentService = async ({
  id,
  name,
  personal_email,
  age,
  department,
}) => {
  try {
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

    const [updatedRows] = await Student.update(
      updates,
      {
        where: {
          id,
        },
      }
    );

    if (updatedRows === 0) {
      throw new AppError(
        MESSAGES.STUDENT_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }

    await clearStudentCache();
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new AppError(
        MESSAGES.EMAIL_ALREADY_EXISTS,
        STATUS_CODES.CONFLICT
      );
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
    throw new AppError(
      MESSAGES.STUDENT_NOT_FOUND,
      STATUS_CODES.NOT_FOUND
    );
  }

  await clearStudentCache();
};