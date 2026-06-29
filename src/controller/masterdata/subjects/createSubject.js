import { Router } from "express";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getsubjectModel } from "../../../model/subjects.js";
import authenticate from "../../../helper/authenticate.js";

const router = Router();

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
    const { subject, subject_code } = req.body || {};

    const subjectModel = await getsubjectModel();

    if (subject == "" || subject == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "subject"));
    }
    if (subject_code == "" || subject_code == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "subject_code"));
    }

    let isCodeExist = await subjectModel.findOne({
      where: {
        isactive: STATE.ACTIVE,
        subject_code,
      },
    });

    let isSubjectExist = await subjectModel.findOne({
      where: {
        isactive: STATE.ACTIVE,
        subject,
      },
    });

    if (isCodeExist) {
      return send(
        res,
        setErrResMsg(RESPONSE.ALRDY_EXIST, "Entry with this subject code"),
      );
    }
    if (isSubjectExist) {
      return send(
        res,
        setErrResMsg(RESPONSE.ALRDY_EXIST, "Entry with this subject"),
      );
    }

    await subjectModel.create({
      subject,
      subject_code,
    });

    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log("create subject: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
