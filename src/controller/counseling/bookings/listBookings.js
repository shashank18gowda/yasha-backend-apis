import { Router } from "express";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getCounselingBookingModel } from "../../../model/counselingBookings.js";
import { getCounselingSlotModel } from "../../../model/counselingSlots.js";
import { getCounselingTypeModel } from "../../../model/counselingTypes.js";
import { getUserModel } from "../../../model/users.js";
import authenticate from "../../../helper/authenticate.js";

const router = Router();

export default router.get("/", authenticate, async (req, res) => {
  try {
    const query = {
      isactive: STATE.ACTIVE,
    };

    if (req.user.role != ROLE.ADMIN && req.user.role != ROLE.TRAINER) {
      query.booked_by = req.user.id;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.counseling_type_id) {
      query.counseling_type_id = req.query.counseling_type_id;
    }

    const counselingBookingModel = getCounselingBookingModel();
    const counselingSlotModel = getCounselingSlotModel();
    const counselingTypeModel = getCounselingTypeModel();
    const userModel = getUserModel();

    const slotWhere = {};

    if (req.user.role == ROLE.TRAINER) {
      slotWhere.trainer_id = req.user.id;
    } else if (req.query.trainer_id) {
      slotWhere.trainer_id = req.query.trainer_id;
    }

    const bookings = await counselingBookingModel.findAll({
      where: query,
      attributes: [
        "counseling_booking_id",
        "counseling_slot_id",
        "counseling_type_id",
        "booked_by",
        "status",
        "notes",
        "booked_at",
        "createdAt",
      ],
      include: [
        {
          model: counselingSlotModel,
          as: "slotInfo",
          where: slotWhere,
          attributes: [
            "counseling_slot_id",
            "trainer_id",
            "scheduled_start",
            "scheduled_end",
            "is_frozen",
          ],
          include: [
            {
              model: userModel,
              as: "trainerInfo",
              attributes: ["user_id", "first_name", "last_name", "email", "mobile"],
            },
          ],
        },
        {
          model: counselingTypeModel,
          as: "counselingTypeInfo",
          attributes: [
            "counseling_type_id",
            "counseling_type",
            "counseling_type_code",
          ],
        },
        {
          model: userModel,
          as: "bookedBy",
          attributes: ["user_id", "first_name", "last_name", "email", "mobile"],
        },
      ],
      order: [[{ model: counselingSlotModel, as: "slotInfo" }, "scheduled_start", "ASC"]],
    });

    if (bookings.length == 0) {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "Counseling bookings"));
    }

    return send(res, RESPONSE.SUCCESS, bookings);
  } catch (err) {
    console.log("list counseling bookings: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
