import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Staff = sequelize.define(
  "Staff",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    staff_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    staff_type: {
      type: DataTypes.ENUM("teaching", "non_teaching"),
      allowNull: false,
    },

    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    must_change_password: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "staff",
    timestamps: true,
    underscored: true,
  },
);

export default Staff;