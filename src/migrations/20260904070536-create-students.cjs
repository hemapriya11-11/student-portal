'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("students", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },

  student_id: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  date_of_birth: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },

  department: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  must_change_password: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },

  created_at: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },

  updated_at: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("students");
  }
};
