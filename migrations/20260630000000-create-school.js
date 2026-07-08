export const up = async (queryInterface, DataTypes, transaction) => {
  const tables = await queryInterface.showAllTables({ transaction });
  const tableNames = tables.map((table) =>
    typeof table === "string" ? table : table.tableName,
  );

  if (!tableNames.includes("schoolmodel")) {
    await queryInterface.createTable(
      "schoolmodel",
      {
        school_id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        school_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        school_code: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        board: {
          //CBSE, ICSE, State Board, IB, IGCSE
          type: DataTypes.STRING,
          allowNull: false,
        },
        school_type: {
          //Government, Private, Aided, International
          type: DataTypes.STRING,
          allowNull: false,
        },

        medium_of_instruction: {
          //English, Kannada, Hindi, etc.
          type: DataTypes.STRING,
          allowNull: false,
        },
        category: {
          //Boys,Girls,Co-ed
          type: DataTypes.STRING,
          allowNull: false,
        },
        principal_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        school_email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        school_phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        city: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        district: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        state: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        country: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        pincode: {
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
        created_by: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "usermodel",
            key: "user_id",
          },
        },
      },
      { transaction },
    );
  }

  if (!tableNames.includes("interestmodel")) {
    await queryInterface.createTable(
      "interestmodel",
      {
        interest_id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        interest_code: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        interest_name: {
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
  }
};

export const down = async (queryInterface, DataTypes, transaction) => {
  await queryInterface.dropTable("schoolmodel", { transaction });
  await queryInterface.dropTable("interestmodel", { transaction });
};
