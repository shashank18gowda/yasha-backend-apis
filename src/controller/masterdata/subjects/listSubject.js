import { Router } from "express";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getsubjectModel } from "../../../model/subjects.js";
import authenticate from "../../../helper/authenticate.js";
import { Op } from "sequelize";

const router = Router();

export default router.get("/", authenticate, async (req, res) => {
  try {
    let query = {
      isactive: STATE.ACTIVE,
    };

    req.query.searchkey
      ? (query.subject = { [Op.iLike]: `${req.query.searchkey}%` })
      : "";

    const subjectModel = await getsubjectModel();

    let subjectData = await subjectModel.findAll({
      where: query,
      attributes: ["subject_id", "subject", "subject_code", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    if (subjectData.length == 0) {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "Subjects"));
    }

    return send(res, RESPONSE.SUCCESS, subjectData);
  } catch (err) {
    console.log("list subject: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
