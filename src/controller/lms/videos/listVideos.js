import { Router } from "express";
import { Op } from "sequelize";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { STATE } from "../../../config/constant.js";
import { getLmsVideoModel } from "../../../model/lmsVideos.js";
import { getLmsVideoCompletionModel } from "../../../model/lmsVideoCompletions.js";
import { getstudentModel } from "../../../model/students.js";
import { getsubjectModel } from "../../../model/subjects.js";
import authenticate from "../../../helper/authenticate.js";

const router = Router();

const getLoggedInStudent = async (userId) => {
  const studentModel = getstudentModel();

  return studentModel.findOne({
    where: {
      user_id: userId,
      isactive: STATE.ACTIVE,
    },
  });
};

export default router.get("/", authenticate, async (req, res) => {
  try {
    const query = {
      isactive: STATE.ACTIVE,
    };

    if (req.query.subject_id) {
      query.subject_id = req.query.subject_id;
    }

    if (req.query.searchkey) {
      query.title = { [Op.iLike]: `${req.query.searchkey}%` };
    }

    const lmsVideoModel = getLmsVideoModel();
    const lmsVideoCompletionModel = getLmsVideoCompletionModel();
    const subjectModel = getsubjectModel();
    const studentData = await getLoggedInStudent(req.user.id);

    const videos = await lmsVideoModel.findAll({
      where: query,
      attributes: [
        "video_id",
        "subject_id",
        "title",
        "description",
        "youtube_url",
        "thumbnail_url",
        "duration_seconds",
        "display_order",
        "createdAt",
      ],
      include: [
        {
          model: subjectModel,
          as: "subjectInfo",
          attributes: ["subject_id", "subject", "subject_code"],
        },
      ],
      order: [
        ["display_order", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

    if (videos.length == 0) {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "LMS videos"));
    }

    let completedVideoIds = [];

    if (studentData) {
      const completions = await lmsVideoCompletionModel.findAll({
        where: {
          student_id: studentData.student_id,
          isactive: STATE.ACTIVE,
        },
        attributes: ["video_id"],
      });

      completedVideoIds = completions.map((completion) => completion.video_id);
    }

    const responseData = videos.map((video) => {
      const plainVideo = video.get({ plain: true });

      return {
        ...plainVideo,
        is_completed: completedVideoIds.includes(plainVideo.video_id),
      };
    });

    return send(res, RESPONSE.SUCCESS, responseData);
  } catch (err) {
    console.log("list LMS videos: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
