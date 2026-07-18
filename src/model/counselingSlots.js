import { DataTypes } from "sequelize";

const counselingSlotModel = {
  counseling_slot_id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  scheduled_start: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  scheduled_end: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  is_frozen: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isactive: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
};

let counselingSlot = null;

export const initCounselingSlotModel = (sequelize) => {
  if (counselingSlot) return counselingSlot;

  counselingSlot = sequelize.define("counselingslotmodel", counselingSlotModel, {
    freezeTableName: true,
  });

  return counselingSlot;
};

export const getCounselingSlotModel = () => {
  if (!counselingSlot) {
    throw new Error(
      "Counseling slot model is not initialized. Call initModels() first.",
    );
  }

  return counselingSlot;
};
