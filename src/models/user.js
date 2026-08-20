import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_name: {
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
    role: {
      type: DataTypes.ENUM("admin", "staff", "student"),
      allowNull: false,
      defaultValue: "student",
    },
    reset_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    reset_token_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    
  },
  {
    tableName: "users",
    timestamps: false,
  },
);

export default User;
