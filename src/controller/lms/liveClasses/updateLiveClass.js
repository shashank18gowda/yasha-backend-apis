import { Router } from "express";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getLmsLiveClassModel } from "../../../model/lmsLiveClasses.js";
import { getsubjectModel } from "../../../model/subjects.js";
import authenticate from "../../../helper/authenticate.js";

const router = Router();

const updatableFields = [
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
  "isactive",
];

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

    const { live_class_id, subject_id } = req.body || {};

    if (live_class_id == "" || live_class_id == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "live_class_id"));
    }

    const lmsLiveClassModel = getLmsLiveClassModel();
    const liveClassData = await lmsLiveClassModel.findOne({
      where: {
        live_class_id,
        isactive: STATE.ACTIVE,
      },
    });

    if (!liveClassData) {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "LMS live class"));
    }

    if (subject_id) {
      const subjectModel = getsubjectModel();
      const subjectData = await subjectModel.findOne({
        where: {
          subject_id,
          isactive: STATE.ACTIVE,
        },
      });

      if (!subjectData) {
        return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "Subject"));
      }
    }

    const updateData = {};

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await lmsLiveClassModel.update(updateData, {
      where: {
        live_class_id,
      },
    });

    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log("update LMS live class: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
