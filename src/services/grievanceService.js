import Grievance from "../models/Grievance.js";
import Student from "../models/student.js";
import Staff from "../models/staff.js";
import { createNotification } from "./notificationService.js";
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

  io.to("role:admin").emit(
    "grievance:created",
    grievance,
  );

  io.to("role:staff").emit(
    "grievance:created",
    grievance,
  );

  const [admins, staffMembers] = await Promise.all([
    Admin.findAll({
      attributes: ["id"],
    }),

    Staff.findAll({
      attributes: ["id"],
    }),
  ]);

  await Promise.all(
    admins.map((admin) =>
      createNotification({
        recipientId: admin.id,
        recipientRole: "admin",
        type: "GRIEVANCE_CREATED",
        title: "New Grievance",
        message: `A new grievance has been created: ${grievance.subject}`,
        metadata: {
          grievanceId: grievance.id,
        },
      }),
    ),
  );

  await Promise.all(
    staffMembers.map((staff) =>
      createNotification({
        recipientId: staff.id,
        recipientRole: "staff",
        type: "GRIEVANCE_CREATED",
        title: "New Grievance",
        message: `A new grievance has been created: ${grievance.subject}`,
        metadata: {
          grievanceId: grievance.id,
        },
      }),
    ),
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

  if (
    user.role === "student" &&
    grievance.student_id !== user.id
  ) {
    throw new AppError(
      "You are not allowed to access this grievance",
      STATUS_CODES.FORBIDDEN,
    );
  }

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

  await createNotification({
    recipientId: grievance.student_id,
    recipientRole: "student",
    type: "GRIEVANCE_STATUS_UPDATED",
    title: "Grievance Status Updated",
    message: `Your grievance "${grievance.subject}" status has been updated to ${status}.`,
    metadata: {
      grievanceId: grievance.id,
      status: grievance.status,
    },
  });

  const io = getIO();

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

  if (grievance.status === "OPEN") {
    grievance.status = "IN_PROGRESS";
  }

  await grievance.save();

  await createNotification({
    recipientId: staffId,
    recipientRole: "staff",
    type: "GRIEVANCE_ASSIGNED",
    title: "New Grievance Assigned",
    message: `A grievance has been assigned to you: "${grievance.subject}".`,
    metadata: {
      grievanceId: grievance.id,
    },
  });

  await createNotification({
    recipientId: grievance.student_id,
    recipientRole: "student",
    type: "GRIEVANCE_ASSIGNED",
    title: "Grievance Assigned",
    message: `Your grievance "${grievance.subject}" has been assigned to a staff member and is now being processed.`,
    metadata: {
      grievanceId: grievance.id,
      assignedStaffId: staffId,
    },
  });

  const io = getIO();

  io.to(
    `user:staff:${staffId}`,
  ).emit(
    "grievance:assigned",
    grievance,
  );

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

  await createNotification({
    recipientId: grievance.student_id,
    recipientRole: "student",
    type: "GRIEVANCE_PRIORITY_UPDATED",
    title: "Grievance Priority Updated",
    message: `The priority of your grievance "${grievance.subject}" has been updated to ${priority}.`,
    metadata: {
      grievanceId: grievance.id,
      priority: grievance.priority,
    },
  });

  const io = getIO();

  io.to(
    `user:student:${grievance.student_id}`,
  ).emit(
    "grievance:updated",
    grievance,
  );

  return grievance;
};