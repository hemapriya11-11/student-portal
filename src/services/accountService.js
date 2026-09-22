import Admin from "../models/admin.js";
import Student from "../models/student.js";
import Staff from "../models/staff.js";

export const findAccountByIdentifier = async (identifier) => {
  const admin = await Admin.findOne({
    where: {
      email: identifier,
    },
  });

  if (admin) {
    return {
      account: admin,
      role: "admin",
    };
  }

  const student = await Student.findOne({
    where: {
      student_id: identifier,
    },
  });

  if (student) {
    return {
      account: student,
      role: "student",
    };
  }

  const staff = await Staff.findOne({
    where: {
      staff_id: identifier,
    },
  });

  if (staff) {
    return {
      account: staff,
      role: "staff",
    };
  }

  return null;
};
export const findAccountByIdAndRole = async (id, role) => {
  switch (role) {
    case "admin":
      return Admin.findByPk(id);

    case "student":
      return Student.findByPk(id);

    case "staff":
      return Staff.findByPk(id);

    default:
      return null;
  }
};
export const findAccountByEmail = async (email) => {
  const admin = await Admin.findOne({
    where: { email },
  });

  if (admin) {
    return {
      account: admin,
      role: "admin",
    };
  }

  const student = await Student.findOne({
    where: { email },
  });

  if (student) {
    return {
      account: student,
      role: "student",
    };
  }

  const staff = await Staff.findOne({
    where: { email },
  });

  if (staff) {
    return {
      account: staff,
      role: "staff",
    };
  }

  return null;
};