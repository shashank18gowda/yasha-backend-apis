import { DataTypes } from "sequelize";

const lmsVideoCompletionModel = {
  completion_id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isactive: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
};

let lmsVideoCompletion = null;

export const initLmsVideoCompletionModel = (sequelize) => {
  if (lmsVideoCompletion) return lmsVideoCompletion;

  lmsVideoCompletion = sequelize.define(
    "lmsvideocompletionmodel",
    lmsVideoCompletionModel,
    {
      freezeTableName: true,
    },
  );

  return lmsVideoCompletion;
};

export const getLmsVideoCompletionModel = () => {
  if (!lmsVideoCompletion) {
    throw new Error(
      "LMS video completion model is not initialized. Call initModels() first.",
    );
  }

  return lmsVideoCompletion;
};
