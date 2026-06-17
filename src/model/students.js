import { DataTypes } from "sequelize";

const studentModel = {
  student_id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: false,
  },
 
  isactive: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
};

let student = null;

export const initstudentModel = (sequelize) => {
  if (student) return student;

  student = sequelize.define("studentmodel", studentModel, {
    freezeTableName: true,
  });

  return student;
};

export const getstudentModel = () => {
  if (!student) {
    throw new Error(
      "student model is not initialized. Call initModels() first.",
    );
  }

  return student;
};
