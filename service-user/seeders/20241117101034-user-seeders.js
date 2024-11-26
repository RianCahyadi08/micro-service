"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "John Doe",
          profession: "Software Engineer",
          role: "admin",
          email: 'john@example.com',
          password: await bcrypt.hash('P@55word', 10),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Doe Smith",
          profession: "Frontend Developer",
          role: "student",
          email: 'doesmith@example.com',
          password: await bcrypt.hash('P@55word', 10),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
     await queryInterface.bulkDelete('users', null, {});
  },
};
