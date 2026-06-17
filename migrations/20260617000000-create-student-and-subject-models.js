export const up = async (queryInterface, DataTypes, transaction) => {
  const tables = await queryInterface.showAllTables({ transaction });
  const tableNames = tables.map((table) =>
    typeof table === "string" ? table : table.tableName,
  );

  if (!tableNames.includes("studentmodel")) {
    await queryInterface.createTable(
      "studentmodel",
      {
        student_id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
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
  }

  if (!tableNames.includes("subjectmodel")) {
    await queryInterface.createTable(
      "subjectmodel",
      {
        subject_id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
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
  }
};

export const down = async (queryInterface, DataTypes, transaction) => {
  await queryInterface.dropTable("subjectmodel", { transaction });
  await queryInterface.dropTable("studentmodel", { transaction });
};
