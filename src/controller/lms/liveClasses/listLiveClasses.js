import { Router } from "express";
import { Op } from "sequelize";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { STATE } from "../../../config/constant.js";
import { getLmsLiveClassModel } from "../../../model/lmsLiveClasses.js";
import { getsubjectModel } from "../../../model/subjects.js";
import authenticate from "../../../helper/authenticate.js";

const router = Router();

export default router.get("/", authenticate, async (req, res) => {
  try {
    const query = {
      isactive: STATE.ACTIVE,
    };

    if (req.query.subject_id) {
      query.subject_id = req.query.subject_id;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.from_date || req.query.to_date) {
      query.scheduled_start = {};

      if (req.query.from_date) {
        query.scheduled_start[Op.gte] = new Date(req.query.from_date);
      }

      if (req.query.to_date) {
        query.scheduled_start[Op.lte] = new Date(req.query.to_date);
      }
    }

    const lmsLiveClassModel = getLmsLiveClassModel();
    const subjectModel = getsubjectModel();

    const liveClasses = await lmsLiveClassModel.findAll({
      where: query,
      attributes: [
        "live_class_id",
        "subject_id",
        "title",
        "description",
        "scheduled_start",
        "scheduled_end",
        "meeting_provider",
        "meeting_id",
        "meeting_url",
        "meeting_password",
        "status",
        "createdAt",
      ],
      include: [
        {
          model: subjectModel,
          as: "subjectInfo",
          attributes: ["subject_id", "subject", "subject_code"],
        },
      ],
      order: [["scheduled_start", "ASC"]],
    });

    if (liveClasses.length == 0) {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "LMS live classes"));
    }

    return send(res, RESPONSE.SUCCESS, liveClasses);
  } catch (err) {
    console.log("list LMS live classes: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
