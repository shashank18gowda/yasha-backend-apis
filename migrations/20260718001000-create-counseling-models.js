export const up = async (queryInterface, DataTypes, transaction) => {
  const tables = await queryInterface.showAllTables({ transaction });
  const tableNames = tables.map((table) =>
    typeof table === "string" ? table : table.tableName,
  );

  if (!tableNames.includes("counselingtypemodel")) {
    await queryInterface.createTable(
      "counselingtypemodel",
      {
        counseling_type_id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        counseling_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        counseling_type_code: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.TEXT,
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
  }

  if (!tableNames.includes("counselingslotmodel")) {
    await queryInterface.createTable(
      "counselingslotmodel",
      {
        counseling_slot_id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        trainer_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "usermodel",
            key: "user_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        scheduled_start: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        scheduled_end: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        is_frozen: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
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

    await queryInterface.addConstraint("counselingslotmodel", {
      fields: ["trainer_id", "scheduled_start"],
      type: "unique",
      name: "counseling_slot_trainer_start_unique",
      transaction,
    });
  }

  if (!tableNames.includes("counselingbookingmodel")) {
    await queryInterface.createTable(
      "counselingbookingmodel",
      {
        counseling_booking_id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        counseling_slot_id: {
          type: DataTypes.UUID,
          allowNull: false,
          unique: true,
          references: {
            model: "counselingslotmodel",
            key: "counseling_slot_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        counseling_type_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "counselingtypemodel",
            key: "counseling_type_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        booked_by: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "usermodel",
            key: "user_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: "CONFIRMED",
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        booked_at: {
          type: DataTypes.DATE,
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
  }
};

export const down = async (queryInterface, DataTypes, transaction) => {
  await queryInterface.dropTable("counselingbookingmodel", { transaction });
  await queryInterface.dropTable("counselingslotmodel", { transaction });
  await queryInterface.dropTable("counselingtypemodel", { transaction });
};
