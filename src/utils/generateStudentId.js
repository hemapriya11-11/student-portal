import Student from "../models/student.js";

export const generateStudentId = async (
admissionYear,
department,
) => {
const year = String(admissionYear).slice(-2);

const normalizedDepartment = department.toUpperCase();

const lastStudent = await Student.findOne({
where: {
admission_year: admissionYear,
department: normalizedDepartment,
},
order: [["id", "DESC"]],
});

let sequence = 1;

if (lastStudent) {
const lastSequence = Number(
lastStudent.student_id.slice(-4),
);


sequence = lastSequence + 1;


}

return `${year}${normalizedDepartment}${String(
    sequence,
  ).padStart(4, "0")}`;
};
