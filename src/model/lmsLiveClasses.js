import { DataTypes } from "sequelize";

const lmsLiveClassModel = {
  live_class_id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
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
};

let lmsLiveClass = null;

export const initLmsLiveClassModel = (sequelize) => {
  if (lmsLiveClass) return lmsLiveClass;

  lmsLiveClass = sequelize.define("lmsliveclassmodel", lmsLiveClassModel, {
    freezeTableName: true,
  });

  return lmsLiveClass;
};

export const getLmsLiveClassModel = () => {
  if (!lmsLiveClass) {
    throw new Error(
      "LMS live class model is not initialized. Call initModels() first.",
    );
  }

  return lmsLiveClass;
};
