import { Router } from "express";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getinterestModel } from "../../../model/interests.js";
import authenticate from "../../../helper/authenticate.js";
import { Op } from "sequelize";

const router = Router();

export default router.get("/", authenticate, async (req, res) => {
  try {
    let query = {
      isactive: STATE.ACTIVE,
    };

    req.query.searchkey
      ? (query.interest = { [Op.iLike]: `${req.query.searchkey}%` })
      : "";

    const interestModel = await getinterestModel();

    let interestData = await interestModel.findAll({
      where: query,
      attributes: [
        "interest_id",
        "interest_name",
        "interest_code",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    if (interestData.length == 0) {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "interests"));
    }

    return send(res, RESPONSE.SUCCESS, interestData);
  } catch (err) {
    console.log("list interest: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
