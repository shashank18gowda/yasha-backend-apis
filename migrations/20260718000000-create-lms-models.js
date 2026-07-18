export const up = async (queryInterface, DataTypes, transaction) => {
  const tables = await queryInterface.showAllTables({ transaction });
  const tableNames = tables.map((table) =>
    typeof table === "string" ? table : table.tableName,
  );

  if (!tableNames.includes("lmsvideomodel")) {
    await queryInterface.createTable(
      "lmsvideomodel",
      {
        video_id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        subject_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "subjectmodel",
            key: "subject_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        youtube_url: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        thumbnail_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        duration_seconds: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        display_order: {
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
  }

  if (!tableNames.includes("lmsliveclassmodel")) {
    await queryInterface.createTable(
      "lmsliveclassmodel",
      {
        live_class_id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        subject_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "subjectmodel",
            key: "subject_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        scheduled_start: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        scheduled_end: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        meeting_provider: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        meeting_id: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        meeting_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        meeting_password: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: "SCHEDULED",
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

  if (!tableNames.includes("lmsvideocompletionmodel")) {
    await queryInterface.createTable(
      "lmsvideocompletionmodel",
      {
        completion_id: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        video_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "lmsvideomodel",
            key: "video_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        student_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "studentmodel",
            key: "student_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        completed_at: {
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

    await queryInterface.addConstraint("lmsvideocompletionmodel", {
      fields: ["video_id", "student_id"],
      type: "unique",
      name: "lms_video_completion_unique",
      transaction,
    });
  }
};

export const down = async (queryInterface, DataTypes, transaction) => {
  await queryInterface.dropTable("lmsvideocompletionmodel", { transaction });
  await queryInterface.dropTable("lmsliveclassmodel", { transaction });
  await queryInterface.dropTable("lmsvideomodel", { transaction });
};
