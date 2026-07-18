import { Router } from "express";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getCounselingTypeModel } from "../../../model/counselingTypes.js";
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

    const { counseling_type, counseling_type_code, description } = req.body || {};

    if (counseling_type == "" || counseling_type == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "counseling_type"));
    }
    if (counseling_type_code == "" || counseling_type_code == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "counseling_type_code"));
    }

    const counselingTypeModel = getCounselingTypeModel();

    const existingType = await counselingTypeModel.findOne({
      where: {
        isactive: STATE.ACTIVE,
        counseling_type_code,
      },
    });

    if (existingType) {
      return send(
        res,
        setErrResMsg(RESPONSE.ALRDY_EXIST, "Entry with this counseling type code"),
      );
    }

    const counselingTypeData = await counselingTypeModel.create({
      counseling_type,
      counseling_type_code,
      description,
    });

    return send(res, RESPONSE.SUCCESS, counselingTypeData);
  } catch (err) {
    console.log("create counseling type: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
