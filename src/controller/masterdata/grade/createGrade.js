import { Router } from "express";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getgradeModel } from "../../../model/grades.js";
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
    const { grade } = req.body || {};

    const gradeModel = await getgradeModel();

    if (grade == "" || grade == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "grade"));
    }

    let isgradeExist = await gradeModel.findOne({
      where: {
        isactive: STATE.ACTIVE,
        grade,
      },
    });

    if (isgradeExist) {
      return send(
        res,
        setErrResMsg(RESPONSE.ALRDY_EXIST, "Entry with this grade"),
      );
    }

    await gradeModel.create({
      grade,
    });

    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log("create grade: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
