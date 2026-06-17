import { DataTypes } from "sequelize";

const userModel = {
  user_id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isactive: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
};

let User = null;

export const initUserModel = (sequelize) => {
  if (User) return User;

  User = sequelize.define("usermodel", userModel, {
    freezeTableName: true,
  });



  return User;
};

export const getUserModel = () => {
  if (!User) {
    throw new Error("User model is not initialized. Call initModels() first.");
  }

  return User;
};
