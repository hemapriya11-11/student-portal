import { DataTypes } from "sequelize";

import sequelize from "../config/sequelize.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    recipient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    recipient_role: {
      type: DataTypes.ENUM(
        "admin",
        "staff",
        "student",
      ),
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
    underscored: true,
  },
);

export default Notification;