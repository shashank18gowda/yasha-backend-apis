import { Router } from "express";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getLmsVideoModel } from "../../../model/lmsVideos.js";
import { getLmsVideoCompletionModel } from "../../../model/lmsVideoCompletions.js";
import { getstudentModel } from "../../../model/students.js";
import authenticate from "../../../helper/authenticate.js";

const router = Router();

export default router.post("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != ROLE.STUDENT) {
      return send(
        res,
        setErrResMsg(
          RESPONSE.ACCESS_DENIED,
          "Only students can mark videos as completed -",
        ),
      );
    }

    const { video_id } = req.body || {};

    if (video_id == "" || video_id == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "video_id"));
    }

    const studentModel = getstudentModel();
    const studentData = await studentModel.findOne({
      where: {
        user_id: req.user.id,
        isactive: STATE.ACTIVE,
      },
    });

    if (!studentData) {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "Student"));
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

    const lmsVideoCompletionModel = getLmsVideoCompletionModel();
    const [completionData, created] = await lmsVideoCompletionModel.findOrCreate({
      where: {
        video_id,
        student_id: studentData.student_id,
      },
      defaults: {
        completed_at: new Date(),
        isactive: STATE.ACTIVE,
      },
    });

    if (!created && completionData.isactive !== STATE.ACTIVE) {
      await completionData.update({
        completed_at: new Date(),
        isactive: STATE.ACTIVE,
      });
    }

    return send(res, RESPONSE.SUCCESS, {
      video_id,
      student_id: studentData.student_id,
      is_completed: true,
      completed_at: completionData.completed_at,
    });
  } catch (err) {
    console.log("mark LMS video completed: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
