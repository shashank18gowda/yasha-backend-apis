import { Router } from "express";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getsubjectModel } from "../../../model/subjects.js";
import authenticate from "../../../helper/authenticate.js";
import { Op } from "sequelize";

const router = Router();

export default router.put("/", authenticate, async (req, res) => {
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
    const subject_id = req.query.subject_id;

    if (subject_id == "" || subject_id == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "subject_id"));
    }

    const subjectModel = await getsubjectModel();

    let updates = {};

    if (subject && subject != undefined) {
      let isSubjectExist = await subjectModel.findOne({
        where: {
          isactive: STATE.ACTIVE,
          subject,
          subject_id: { [Op.ne]: subject_id },
        },
      });

      if (isSubjectExist) {
        return send(
          res,
          setErrResMsg(RESPONSE.ALRDY_EXIST, "Entry with this subject"),
        );
      }
      updates.subject = subject;
    }
    if (subject_code && subject_code != undefined) {
      let isSubjectExist = await subjectModel.findOne({
        where: {
          isactive: STATE.ACTIVE,
          subject_code,
          subject_id: { [Op.ne]: subject_id },
        },
      });

      if (isSubjectExist) {
        return send(
          res,
          setErrResMsg(RESPONSE.ALRDY_EXIST, "Entry with this subject code"),
        );
      }
      updates.subject_code = subject_code;
    }

    await subjectModel.update(updates, {
      where: {
        subject_id,
      },
    });

    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log("update subject: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
