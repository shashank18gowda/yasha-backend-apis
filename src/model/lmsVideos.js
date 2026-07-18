import { DataTypes } from "sequelize";

const lmsVideoModel = {
  video_id: {
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
};

let lmsVideo = null;

export const initLmsVideoModel = (sequelize) => {
  if (lmsVideo) return lmsVideo;

  lmsVideo = sequelize.define("lmsvideomodel", lmsVideoModel, {
    freezeTableName: true,
  });

  return lmsVideo;
};

export const getLmsVideoModel = () => {
  if (!lmsVideo) {
    throw new Error("LMS video model is not initialized. Call initModels() first.");
  }

  return lmsVideo;
};
