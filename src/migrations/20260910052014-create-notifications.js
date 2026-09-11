export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("notifications", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    recipient_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    recipient_role: {
      type: Sequelize.ENUM(
        "admin",
        "staff",
        "student",
      ),
      allowNull: false,
    },

    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    message: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    is_read: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    metadata: {
      type: Sequelize.JSON,
      allowNull: true,
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
  await queryInterface.dropTable("notifications");
}