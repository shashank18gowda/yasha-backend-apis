import { DataTypes } from "sequelize";

const interestModel = {
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
};

let interest = null;

export const initinterestModel = (sequelize) => {
  if (interest) return interest;

  interest = sequelize.define("interestmodel", interestModel, {
    freezeTableName: true,
  });

  return interest;
};

export const getinterestModel = () => {
  if (!interest) {
    throw new Error(
      "interest model is not initialized. Call initModels() first.",
    );
  }

  return interest;
};
