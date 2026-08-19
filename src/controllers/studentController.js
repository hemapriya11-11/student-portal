import { pool } from "../config/db.js";

export const createStudent = async (req, res) => {
  try {
    const { name, personal_email, age, department } = req.body
    const [result] = await pool.query(
      `insert into students(name,personal_email,age,department)
          values(?,?,?,?)`, [name, personal_email, age, department]
    )
    res.status(201).json({
      message: "student created successfully",
      studentId: result.insertId
    })
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      message: "failed to create student"
    })
  }
}
export const getStudent = async (req, res) => {
  try {
    const [student] = await pool.query("select * from students")
    res.status(200).send(student)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({
      message: "failed to fetch students"
    })


  }
}

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params

    const [student] = await pool.query("select * from students where id=?", [id])
    res.status(200).json(student)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({
      message: "failed to fetch the student"
    })
  }
}


export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params
    const { name, personal_email, age, department } = req.body
    const [student] = await pool.query("update students set name=? ,personal_email=?,age=?,department=? where id=?", [name, personal_email, age, department, id])
    if (student.affectedRows == 0) {
      return res.status(404).json({
        message: "Student not found"
      });
    }
    res.status(200).json({
      message: `student with student id ${id} is updated successfull`
    })
  }
  catch (err) {
    console.log(err)
    res.status(500).json({
      message: "failed to update"
    })
  }
}
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params

    const [student] = await pool.query("delete from students where id=?", [id])
    res.status(200).json({
      message: "deleted successfully"
    })
    if (student.affectedRows == 0) {
      return res.status(404).json({
        message: "Student not found"
      });
    }
  }
  catch (err) {
    console.log(err)
    res.status(500).json({
      message: "failed to fetch the student"
    })
  }
}
export const patchStudent = async (req, res) => {
  try {
    const { id } = req.params
    const { name, personal_email, age, department } = req.body
    const fields = []
    const values = []
    if (name !== undefined) {
      fields.push("name=?")
      values.push(name)
    }
    if (personal_email !== undefined) {
      fields.push("personal_email=?")
      values.push(personal_email)
    }
    if (age !== undefined) {
      fields.push("age=?")
      values.push(age)
    }
    if (department !== undefined) {
      fields.push("department=?")
      values.push(department)
    }
    if (fields.length === 0) {
      return res.status(400).json({
        message: "no fields provided for update"
      })
    }
    values.push(id)
    const [result] = await pool.query(`update students set ${fields.join(",")} where id=?`, values)
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "student not found"
      })
    }
    res.status(201).json({
      message: "updated successfully"
    })
  }
  catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Failed to update student" })

  }
}




