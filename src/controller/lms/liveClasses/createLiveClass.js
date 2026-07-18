import { Router } from "express";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getLmsLiveClassModel } from "../../../model/lmsLiveClasses.js";
import { getsubjectModel } from "../../../model/subjects.js";
import authenticate from "../../../helper/authenticate.js";

const router = Router();

const isEmpty = (value) => value === "" || value === undefined || value === null;

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

    const {
      subject_id,
      title,
      description,
      scheduled_start,
      scheduled_end,
      meeting_provider,
      meeting_id,
      meeting_url,
      meeting_password,
      status,
    } = req.body || {};

    if (isEmpty(subject_id)) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "subject_id"));
    }
    if (isEmpty(title)) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "title"));
    }
    if (isEmpty(scheduled_start)) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "scheduled_start"));
    }

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

    const lmsLiveClassModel = getLmsLiveClassModel();
    const liveClassData = await lmsLiveClassModel.create({
      subject_id,
      title,
      description,
      scheduled_start,
      scheduled_end,
      meeting_provider,
      meeting_id,
      meeting_url,
      meeting_password,
      status,
    });

    return send(res, RESPONSE.SUCCESS, liveClassData);
  } catch (err) {
    console.log("create LMS live class: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
