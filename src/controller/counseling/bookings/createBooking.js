import { Router } from "express";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import {
  COUNSELING_BOOKING_STATUS,
  ROLE,
  STATE,
} from "../../../config/constant.js";
import { getCounselingBookingModel } from "../../../model/counselingBookings.js";
import { getCounselingSlotModel } from "../../../model/counselingSlots.js";
import { getCounselingTypeModel } from "../../../model/counselingTypes.js";
import { getUserModel } from "../../../model/users.js";
import authenticate from "../../../helper/authenticate.js";

const router = Router();

export default router.post("/", authenticate, async (req, res) => {
  try {
    const { trainer_id, counseling_type_id, counseling_slot_id, notes } =
      req.body || {};

    if (trainer_id == "" || trainer_id == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "trainer_id"));
    }
    if (counseling_type_id == "" || counseling_type_id == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "counseling_type_id"));
    }
    if (counseling_slot_id == "" || counseling_slot_id == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "counseling_slot_id"));
    }

    const userModel = getUserModel();
    const trainerData = await userModel.findOne({
      where: {
        user_id: trainer_id,
        role: ROLE.TRAINER,
        isactive: STATE.ACTIVE,
      },
    });

    if (!trainerData) {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "Trainer"));
    }

    const counselingTypeModel = getCounselingTypeModel();
    const counselingTypeData = await counselingTypeModel.findOne({
      where: {
        counseling_type_id,
        isactive: STATE.ACTIVE,
      },
    });

    if (!counselingTypeData) {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "Counseling type"));
    }

    const counselingSlotModel = getCounselingSlotModel();
    const counselingBookingModel = getCounselingBookingModel();
    const sequelize = counselingBookingModel.sequelize;
    let bookingData = null;

    await sequelize.transaction(async (transaction) => {
      const slotData = await counselingSlotModel.findOne({
        where: {
          counseling_slot_id,
          trainer_id,
          isactive: STATE.ACTIVE,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!slotData) {
        throw new Error("SLOT_NOT_FOUND");
      }

      if (slotData.is_frozen == STATE.ACTIVE) {
        throw new Error("SLOT_ALREADY_FROZEN");
      }

      await slotData.update(
        {
          is_frozen: STATE.ACTIVE,
        },
        { transaction },
      );

      bookingData = await counselingBookingModel.create(
        {
          counseling_slot_id,
          counseling_type_id,
          booked_by: req.user.id,
          status: COUNSELING_BOOKING_STATUS.CONFIRMED,
          notes,
          booked_at: new Date(),
        },
        { transaction },
      );
    });

    return send(res, RESPONSE.SUCCESS, bookingData);
  } catch (err) {
    if (err.message === "SLOT_NOT_FOUND") {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "Counseling slot"));
    }

    if (err.message === "SLOT_ALREADY_FROZEN") {
      return send(res, setErrResMsg(RESPONSE.ALRDY_EXIST, "Booking for this slot"));
    }

    console.log("create counseling booking: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
