import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

export const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(50),
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
    tableName:"Students",
    timestamps:false,
  }
  
);

