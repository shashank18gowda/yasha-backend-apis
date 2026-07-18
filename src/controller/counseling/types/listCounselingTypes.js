import { Router } from "express";
import { Op } from "sequelize";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { STATE } from "../../../config/constant.js";
import { getCounselingTypeModel } from "../../../model/counselingTypes.js";
import authenticate from "../../../helper/authenticate.js";

const router = Router();

export default router.get("/", authenticate, async (req, res) => {
  try {
    const query = {
      isactive: STATE.ACTIVE,
    };

    if (req.query.searchkey) {
      query.counseling_type = { [Op.iLike]: `${req.query.searchkey}%` };
    }

    const counselingTypeModel = getCounselingTypeModel();
    const counselingTypes = await counselingTypeModel.findAll({
      where: query,
      attributes: [
        "counseling_type_id",
        "counseling_type",
        "counseling_type_code",
        "description",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    if (counselingTypes.length == 0) {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "Counseling types"));
    }

    return send(res, RESPONSE.SUCCESS, counselingTypes);
  } catch (err) {
    console.log("list counseling types: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
