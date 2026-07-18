import { DataTypes } from "sequelize";

const counselingTypeModel = {
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
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isactive: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
};

let counselingType = null;

export const initCounselingTypeModel = (sequelize) => {
  if (counselingType) return counselingType;

  counselingType = sequelize.define("counselingtypemodel", counselingTypeModel, {
    freezeTableName: true,
  });

  return counselingType;
};

export const getCounselingTypeModel = () => {
  if (!counselingType) {
    throw new Error(
      "Counseling type model is not initialized. Call initModels() first.",
    );
  }

  return counselingType;
};
