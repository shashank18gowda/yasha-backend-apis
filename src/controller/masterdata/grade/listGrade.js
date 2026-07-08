import { Router } from "express";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getgradeModel } from "../../../model/grades.js";
import authenticate from "../../../helper/authenticate.js";
import { Op } from "sequelize";

const router = Router();

export default router.get("/", authenticate, async (req, res) => {
  try {
    let query = {
      isactive: STATE.ACTIVE,
    };

    req.query.searchkey
      ? (query.grade = { [Op.iLike]: `${req.query.searchkey}%` })
      : "";

    const gradeModel = await getgradeModel();

    let gradeData = await gradeModel.findAll({
      where: query,
      attributes: ["grade_id", "grade", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    if (gradeData.length == 0) {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "grades"));
    }

    return send(res, RESPONSE.SUCCESS, gradeData);
  } catch (err) {
    console.log("list grade: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
