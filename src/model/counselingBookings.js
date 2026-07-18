import { DataTypes } from "sequelize";

const counselingBookingModel = {
  counseling_booking_id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "CONFIRMED",
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  booked_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isactive: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
};

let counselingBooking = null;

export const initCounselingBookingModel = (sequelize) => {
  if (counselingBooking) return counselingBooking;

  counselingBooking = sequelize.define(
    "counselingbookingmodel",
    counselingBookingModel,
    {
      freezeTableName: true,
    },
  );

  return counselingBooking;
};

export const getCounselingBookingModel = () => {
  if (!counselingBooking) {
    throw new Error(
      "Counseling booking model is not initialized. Call initModels() first.",
    );
  }

  return counselingBooking;
};
