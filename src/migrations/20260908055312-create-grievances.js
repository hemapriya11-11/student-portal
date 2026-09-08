export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("grievances", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    student_id: {
      type: Sequelize.INTEGER,
      allowNull: false,

      references: {
        model: "students",
        key: "id",
      },

      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    subject: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    category: {
      type: Sequelize.ENUM(
        "ACADEMIC",
        "ADMINISTRATION",
        "FACILITY",
        "EXAMINATION",
        "OTHER",
      ),
      allowNull: false,
    },

    priority: {
      type: Sequelize.ENUM("LOW", "MEDIUM", "HIGH"),
      allowNull: false,
      defaultValue: "MEDIUM",
    },

    status: {
      type: Sequelize.ENUM(
        "OPEN",
        "IN_PROGRESS",
        "RESOLVED",
        "REJECTED",
      ),
      allowNull: false,
      defaultValue: "OPEN",
    },

    assigned_staff_id: {
      type: Sequelize.INTEGER,
      allowNull: true,

      references: {
        model: "staff",
        key: "id",
      },

      onUpdate: "CASCADE",
      onDelete: "SET NULL",
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
}

export async function down(queryInterface) {
  await queryInterface.dropTable("grievances");
}