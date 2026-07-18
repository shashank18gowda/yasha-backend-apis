import { Router } from "express";
import { Op } from "sequelize";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { STATE } from "../../../config/constant.js";
import { getCounselingSlotModel } from "../../../model/counselingSlots.js";
import { getUserModel } from "../../../model/users.js";
import authenticate from "../../../helper/authenticate.js";

const router = Router();

const getDateRange = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return null;

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  return [startDate, endDate];
};

export default router.get("/", authenticate, async (req, res) => {
  try {
    const query = {
      isactive: STATE.ACTIVE,
    };

    if (req.query.trainer_id) {
      query.trainer_id = req.query.trainer_id;
    }

    if (req.query.date) {
      const dateRange = getDateRange(req.query.date);

      if (!dateRange) {
        return send(res, setErrResMsg(RESPONSE.INVALID, "date"));
      }

      query.scheduled_start = { [Op.between]: dateRange };
    }

    if (req.query.available_only !== "false") {
      query.is_frozen = STATE.INACTIVE;
    }

    const counselingSlotModel = getCounselingSlotModel();
    const userModel = getUserModel();
    const slots = await counselingSlotModel.findAll({
      where: query,
      attributes: [
        "counseling_slot_id",
        "trainer_id",
        "scheduled_start",
        "scheduled_end",
        "is_frozen",
        "createdAt",
      ],
      include: [
        {
          model: userModel,
          as: "trainerInfo",
          attributes: ["user_id", "first_name", "last_name", "email", "mobile"],
        },
      ],
      order: [["scheduled_start", "ASC"]],
    });

    if (slots.length == 0) {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "Counseling slots"));
    }

    return send(res, RESPONSE.SUCCESS, slots);
  } catch (err) {
    console.log("list counseling slots: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
