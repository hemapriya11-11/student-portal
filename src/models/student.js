import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    personal_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "students",
    timestamps: false,
  },
);

export default Student;