import { DataTypes } from "sequelize";

const schoolModel = {
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
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "usermodel",
      key: "user_id",
    },
  },
};

let school = null;

export const initschoolModel = (sequelize) => {
  if (school) return school;

  school = sequelize.define("schoolmodel", schoolModel, {
    freezeTableName: true,
  });

  return school;
};

export const getschoolModel = () => {
  if (!school) {
    throw new Error(
      "school model is not initialized. Call initModels() first.",
    );
  }

  return school;
};
