import { DataTypes, INTEGER } from "sequelize";
import sequelize from "../config/sequelize.js";


const Grievance = sequelize.define(
  "Grievance",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "students",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    category: {
      type: DataTypes.ENUM(
        "ACADEMIC",
        "ADMINISTRATION",
        "FACILITY",
        "EXAMINATION",
        "OTHER",
      ),
      allowNull: false,
    },

    priority: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
      allowNull: false,
      defaultValue: "MEDIUM",
    },

    status: {
      type: DataTypes.ENUM(
        "OPEN",
        "IN_PROGRESS",
        "RESOLVED",
        "REJECTED",
      ),
      allowNull: false,
      defaultValue: "OPEN",
    },

    assigned_staff_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "staff",
        key: "id",
      },
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "grievances",
    timestamps: true,
    underscored: true,
  },
);

export default Grievance;