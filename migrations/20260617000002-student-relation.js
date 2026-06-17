export const up = async (queryInterface, DataTypes, transaction) => {
  const tables = await queryInterface.showAllTables({ transaction });
  const tableNames = tables.map((table) =>
    typeof table === "string" ? table : table.tableName,
  );

  if (!tableNames.includes("grademodel")) {

   await queryInterface.addColumn(
  "studentmodel",
  "user_id",
  {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "usermodel",
      key: "user_id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  { transaction },
);
  }
};

export const down = async (queryInterface, DataTypes, transaction) => {
  await queryInterface.removeColumn("studentmodel", "user_id", {
  transaction,
});
};
