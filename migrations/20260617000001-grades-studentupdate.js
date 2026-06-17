export const up = async (queryInterface, DataTypes, transaction) => {
  const tables = await queryInterface.showAllTables({ transaction });
  const tableNames = tables.map((table) =>
    typeof table === "string" ? table : table.tableName,
  );

  if (!tableNames.includes("grademodel")) {
    await queryInterface.createTable(
      "grademodel",
      {
        grade_id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        grade: {
          type: DataTypes.STRING,
          allowNull: false,
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
    await queryInterface.addColumn(
      "studentmodel",
      "dob",
      {
        type: DataTypes.STRING,
        allowNull: false,
      },
      { transaction },
    );
  }
};

export const down = async (queryInterface, DataTypes, transaction) => {
  await queryInterface.dropTable("grademodel", { transaction });
  await queryInterface.removeColumn("studentmodel", "dob", {
    transaction,
  });
};
