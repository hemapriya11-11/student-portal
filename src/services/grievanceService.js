import Grievance from "../models/Grievance.js";
import Student from "../models/Student.js";
import Staff from "../models/Staff.js";

import { AppError } from "../utils/appError.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { getIO } from "../socket/socket.js";


export const createGrievance = async (
  studentId,
  grievanceData,
) => {
  const grievance = await Grievance.create({
    ...grievanceData,
    student_id: studentId,
  });

  const io = getIO();

  // Notify admins and staff that a new grievance exists
  io.to("role:admin").emit(
    "grievance:created",
    grievance,
  );

  io.to("role:staff").emit(
    "grievance:created",
    grievance,
  );

  return grievance;
};


export const getMyGrievances = async (studentId) => {
  const grievances = await Grievance.findAll({
    where: {
      student_id: studentId,
    },

    include: [
      {
        model: Staff,
        as: "assignedStaff",

        attributes: [
          "id",
          "staff_id",
          "name",
          "department",
          "designation",
        ],
      },
    ],

    order: [["created_at", "DESC"]],
  });

  return grievances;
};


export const getAllGrievances = async () => {
  const grievances = await Grievance.findAll({
    include: [
      {
        model: Student,
        as: "student",

        attributes: [
          "id",
          "student_id",
          "name",
          "email",
          "department",
        ],
      },

      {
        model: Staff,
        as: "assignedStaff",

        attributes: [
          "id",
          "staff_id",
          "name",
          "department",
        ],
      },
    ],

    order: [["created_at", "DESC"]],
  });

  return grievances;
};


export const getGrievanceById = async (
  grievanceId,
  user,
) => {
  const grievance = await Grievance.findByPk(
    grievanceId,
    {
      include: [
        {
          model: Student,
          as: "student",

          attributes: [
            "id",
            "student_id",
            "name",
            "email",
            "department",
          ],
        },

        {
          model: Staff,
          as: "assignedStaff",

          attributes: [
            "id",
            "staff_id",
            "name",
            "department",
          ],
        },
      ],
    },
  );

  if (!grievance) {
    throw new AppError(
      "Grievance not found",
      STATUS_CODES.NOT_FOUND,
    );
  }

  // Student can only view their own grievance
  if (
    user.role === "student" &&
    grievance.student_id !== user.id
  ) {
    throw new AppError(
      "You are not allowed to access this grievance",
      STATUS_CODES.FORBIDDEN,
    );
  }

  // Staff can only view grievances assigned to them
  if (
    user.role === "staff" &&
    grievance.assigned_staff_id !== user.id
  ) {
    throw new AppError(
      "You are not allowed to access this grievance",
      STATUS_CODES.FORBIDDEN,
    );
  }

  return grievance;
};


export const updateGrievanceStatus = async (
  grievanceId,
  status,
  user,
) => {
  const grievance = await Grievance.findByPk(
    grievanceId,
  );

  if (!grievance) {
    throw new AppError(
      "Grievance not found",
      STATUS_CODES.NOT_FOUND,
    );
  }

  // Staff can only update grievances assigned to them
  if (
    user.role === "staff" &&
    grievance.assigned_staff_id !== user.id
  ) {
    throw new AppError(
      "You can only update grievances assigned to you",
      STATUS_CODES.FORBIDDEN,
    );
  }

  grievance.status = status;

  await grievance.save();

  const io = getIO();

  // Notify the student who owns this grievance
  io.to(
    `user:student:${grievance.student_id}`,
  ).emit(
    "grievance:updated",
    grievance,
  );

  return grievance;
};


export const assignGrievance = async (
  grievanceId,
  staffId,
) => {
  const grievance = await Grievance.findByPk(
    grievanceId,
  );

  if (!grievance) {
    throw new AppError(
      "Grievance not found",
      STATUS_CODES.NOT_FOUND,
    );
  }

  const staff = await Staff.findByPk(staffId);

  if (!staff) {
    throw new AppError(
      "Staff member not found",
      STATUS_CODES.NOT_FOUND,
    );
  }

  grievance.assigned_staff_id = staffId;

  // Automatically move OPEN grievance into progress
  if (grievance.status === "OPEN") {
    grievance.status = "IN_PROGRESS";
  }

  await grievance.save();

  const io = getIO();

  // Notify assigned staff member
  io.to(
    `user:staff:${staffId}`,
  ).emit(
    "grievance:assigned",
    grievance,
  );

  // Notify grievance owner
  io.to(
    `user:student:${grievance.student_id}`,
  ).emit(
    "grievance:updated",
    grievance,
  );

  return grievance;
};


export const updateGrievancePriority = async (
  grievanceId,
  priority,
) => {
  const grievance = await Grievance.findByPk(
    grievanceId,
  );

  if (!grievance) {
    throw new AppError(
      "Grievance not found",
      STATUS_CODES.NOT_FOUND,
    );
  }

  grievance.priority = priority;

  await grievance.save();

  const io = getIO();

  // Notify grievance owner about priority changes
  io.to(
    `user:student:${grievance.student_id}`,
  ).emit(
    "grievance:updated",
    grievance,
  );

  return grievance;
};