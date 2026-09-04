'use strict';

const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      12,
    );

    await queryInterface.bulkInsert("admins", [
      {
        admin_name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "admins",
      {
        email: process.env.ADMIN_EMAIL,
      },
      {},
    );
  },
};