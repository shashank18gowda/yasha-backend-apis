import { DataTypes } from "sequelize";

const subjectModel = {
  subject_id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
 
 
  isactive: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
};

let subject = null;

export const initsubjectModel = (sequelize) => {
  if (subject) return subject;

  subject = sequelize.define("subjectmodel", subjectModel, {
    freezeTableName: true,
  });

  return subject;
};

export const getsubjectModel = () => {
  if (!subject) {
    throw new Error("subject model is not initialized. Call initModels() first.");
  }

  return subject;
};
