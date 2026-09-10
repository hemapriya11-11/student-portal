import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Announcement = sequelize.define(
  "Announcement",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    audience: {
      type: DataTypes.ENUM("ALL", "STUDENTS", "STAFF"),
      allowNull: false,
      defaultValue: "ALL",
    },

    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    created_by_role: {
      type: DataTypes.ENUM("admin", "staff"),
      allowNull: false,
    },
  },
  {
    tableName: "announcements",
    timestamps: true,
    underscored: true,
  },
);

export default Announcement;