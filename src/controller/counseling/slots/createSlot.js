import { Router } from "express";
import { Op } from "sequelize";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getCounselingSlotModel } from "../../../model/counselingSlots.js";
import { getUserModel } from "../../../model/users.js";
import authenticate from "../../../helper/authenticate.js";

const router = Router();
const SLOT_DURATION_MINUTES = 30;

const getSlotEndTime = (startDate) =>
  new Date(startDate.getTime() + SLOT_DURATION_MINUTES * 60 * 1000);

export default router.post("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != ROLE.ADMIN && req.user.role != ROLE.TRAINER) {
      return send(
        res,
        setErrResMsg(
          RESPONSE.ACCESS_DENIED,
          "You are not authorized to perform this action -",
        ),
      );
    }

    const { trainer_id, scheduled_start } = req.body || {};
    const slotTrainerId = req.user.role == ROLE.TRAINER ? req.user.id : trainer_id;

    if (slotTrainerId == "" || slotTrainerId == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "trainer_id"));
    }
    if (scheduled_start == "" || scheduled_start == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "scheduled_start"));
    }

    const startDate = new Date(scheduled_start);

    if (Number.isNaN(startDate.getTime())) {
      return send(res, setErrResMsg(RESPONSE.INVALID, "scheduled_start"));
    }

    const endDate = getSlotEndTime(startDate);
    const userModel = getUserModel();
    const trainerData = await userModel.findOne({
      where: {
        user_id: slotTrainerId,
        role: ROLE.TRAINER,
        isactive: STATE.ACTIVE,
      },
    });

    if (!trainerData) {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "Trainer"));
    }

    const counselingSlotModel = getCounselingSlotModel();
    const existingSlot = await counselingSlotModel.findOne({
      where: {
        trainer_id: slotTrainerId,
        isactive: STATE.ACTIVE,
        [Op.or]: [
          {
            scheduled_start: {
              [Op.between]: [startDate, new Date(endDate.getTime() - 1)],
            },
          },
          {
            scheduled_end: {
              [Op.between]: [new Date(startDate.getTime() + 1), endDate],
            },
          },
        ],
      },
    });

    if (existingSlot) {
      return send(
        res,
        setErrResMsg(RESPONSE.ALRDY_EXIST, "Slot for this trainer and time"),
      );
    }

    const slotData = await counselingSlotModel.create({
      trainer_id: slotTrainerId,
      scheduled_start: startDate,
      scheduled_end: endDate,
    });

    return send(res, RESPONSE.SUCCESS, slotData);
  } catch (err) {
    console.log("create counseling slot: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
