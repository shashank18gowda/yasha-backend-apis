import { DataTypes } from "sequelize";

const gradeModel = {
  grade_id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 
  isactive: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
};

let grade = null;

export const initgradeModel = (sequelize) => {
  if (grade) return grade;

  grade = sequelize.define("grademodel", gradeModel, {
    freezeTableName: true,
  });

  return grade;
};

export const getgradeModel = () => {
  if (!grade) {
    throw new Error(
      "grade model is not initialized. Call initModels() first.",
    );
  }

  return grade;
};
