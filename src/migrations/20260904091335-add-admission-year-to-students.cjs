'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
async up(queryInterface, Sequelize) {
await queryInterface.addColumn("students", "admission_year", {
type: Sequelize.INTEGER,
allowNull: false,
after: "date_of_birth",
});
},

async down(queryInterface) {
await queryInterface.removeColumn(
"students",
"admission_year",
);
},
};
