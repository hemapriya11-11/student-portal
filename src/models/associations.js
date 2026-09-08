import Student from "./Student.js";
import Staff from "./Staff.js";
import Grievance from "./Grievance.js";



Student.hasMany(Grievance, {
  foreignKey: "student_id",
  as: "grievances",
});

Grievance.belongsTo(Student, {
  foreignKey: "student_id",
  as: "student",
});


Staff.hasMany(Grievance, {
  foreignKey: "assigned_staff_id",
  as: "assignedGrievances",
});

Grievance.belongsTo(Staff, {
  foreignKey: "assigned_staff_id",
  as: "assignedStaff",
});