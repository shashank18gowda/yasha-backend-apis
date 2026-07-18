import { Router } from "express";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getLmsVideoModel } from "../../../model/lmsVideos.js";
import { getsubjectModel } from "../../../model/subjects.js";
import authenticate from "../../../helper/authenticate.js";

const router = Router();

const updatableFields = [
  "subject_id",
  "title",
  "description",
  "youtube_url",
  "thumbnail_url",
  "duration_seconds",
  "display_order",
  "isactive",
];

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

    const { video_id, subject_id } = req.body || {};

    if (video_id == "" || video_id == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "video_id"));
    }

    const lmsVideoModel = getLmsVideoModel();
    const videoData = await lmsVideoModel.findOne({
      where: {
        video_id,
        isactive: STATE.ACTIVE,
      },
    });

    if (!videoData) {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "LMS video"));
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

    await lmsVideoModel.update(updateData, {
      where: {
        video_id,
      },
    });

    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log("update LMS video: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
