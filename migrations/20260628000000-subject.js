export const up = async (queryInterface, DataTypes, transaction) => {
  const tables = await queryInterface.showAllTables({ transaction });
  const tableNames = tables.map((table) =>
    typeof table === "string" ? table : table.tableName,
  );

  if (tableNames.includes("subjectmodel")) {
    await queryInterface.addColumn(
      "subjectmodel",
      "subject",
      {
        type: DataTypes.STRING,
        allowNull: false,
      },
      { transaction }
    );

    await queryInterface.addColumn(
      "subjectmodel",
      "subject_code",
      {
        type: DataTypes.STRING,
        allowNull: true,
      },
      { transaction }
    );
  }
};

export const down = async (queryInterface, DataTypes, transaction) => {
  await queryInterface.removeColumn("subjectmodel", "subject", { transaction });
  await queryInterface.removeColumn("subjectmodel", "subject_code", { transaction });
};