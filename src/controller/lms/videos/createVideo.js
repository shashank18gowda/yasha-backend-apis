import { Router } from "express";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getLmsVideoModel } from "../../../model/lmsVideos.js";
import { getsubjectModel } from "../../../model/subjects.js";
import authenticate from "../../../helper/authenticate.js";

const router = Router();

const isEmpty = (value) => value === "" || value === undefined || value === null;

export default router.post("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != ROLE.ADMIN) {
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
      youtube_url,
      thumbnail_url,
      duration_seconds,
      display_order,
    } = req.body || {};

    if (isEmpty(subject_id)) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "subject_id"));
    }
    if (isEmpty(title)) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "title"));
    }
    if (isEmpty(youtube_url)) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "youtube_url"));
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

    const lmsVideoModel = getLmsVideoModel();
    const videoData = await lmsVideoModel.create({
      subject_id,
      title,
      description,
      youtube_url,
      thumbnail_url,
      duration_seconds,
      display_order,
    });

    return send(res, RESPONSE.SUCCESS, videoData);
  } catch (err) {
    console.log("create LMS video: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
