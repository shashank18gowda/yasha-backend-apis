export const up = async (queryInterface, DataTypes, transaction) => {
  const tables = await queryInterface.showAllTables({ transaction });
  const tableNames = tables.map((table) =>
    typeof table === "string" ? table : table.tableName,
  );

  if (tableNames.includes("usermodel")) return;

  await queryInterface.createTable(
    "usermodel",
    {
      user_id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isactive: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { transaction },
  );
};

export const down = async (queryInterface, DataTypes, transaction) => {
  await queryInterface.dropTable("usermodel", { transaction });
};
