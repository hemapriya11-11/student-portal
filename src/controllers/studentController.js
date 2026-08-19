import { pool } from "../config/db.js";

export const createStudent = async (req, res) => {
  try {
    const { name, personal_email, age, department } = req.body;

    const [result] = await pool.query(
      `INSERT INTO students
       (name, personal_email, age, department)
       VALUES (?, ?, ?, ?)`,
      [name, personal_email, age, department],
    );

    res.status(201).json({
      message: "Student created successfully",
      studentId: result.insertId,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({
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
      limit = 10
    } = req.query;

    const conditions = [];
    const values = [];

    if (id) {
      conditions.push("id = ?");
      values.push(id);
    }

    if (name) {
      conditions.push("name LIKE ?");
      values.push(`%${name}%`);
    }

    if (age) {
      conditions.push("age = ?");
      values.push(age);
    }

    if (department) {
      conditions.push("department LIKE ?");
      values.push(`%${department}%`);
    }

    if (personal_email) {
      conditions.push("personal_email = ?");
      values.push(personal_email);
    }

    let query = "SELECT * FROM students";

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const offset = (Number(page) - 1) * Number(limit);

    query += " LIMIT ? OFFSET ?";

    values.push(Number(limit), offset);

    const [students] = await pool.query(query, values);

    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      students
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch students"
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, personal_email, age, department } = req.body;

    const [result] = await pool.query(
      `UPDATE students
       SET name = ?, personal_email = ?, age = ?, department = ?
       WHERE id = ?`,
      [name, personal_email, age, department, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: `Student with ID ${id} updated successfully`,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({
      message: "Failed to update student",
    });
  }
};

export const patchStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, personal_email, age, department } = req.body;

    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push("name = ?");
      values.push(name);
    }

    if (personal_email !== undefined) {
      fields.push("personal_email = ?");
      values.push(personal_email);
    }

    if (age !== undefined) {
      fields.push("age = ?");
      values.push(age);
    }

    if (department !== undefined) {
      fields.push("department = ?");
      values.push(department);
    }

    values.push(id);

    const [result] = await pool.query(
      `UPDATE students
       SET ${fields.join(", ")}
       WHERE id = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({
      message: "Failed to update student",
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM students WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete student",
    });
  }
};
