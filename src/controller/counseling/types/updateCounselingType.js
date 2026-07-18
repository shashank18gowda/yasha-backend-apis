import { Router } from "express";
import { Op } from "sequelize";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getCounselingTypeModel } from "../../../model/counselingTypes.js";
import authenticate from "../../../helper/authenticate.js";

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

    const counseling_type_id = req.query.counseling_type_id;
    const { counseling_type, counseling_type_code, description, isactive } =
      req.body || {};

    if (counseling_type_id == "" || counseling_type_id == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "counseling_type_id"));
    }

    const counselingTypeModel = getCounselingTypeModel();
    const counselingTypeData = await counselingTypeModel.findOne({
      where: {
        counseling_type_id,
        isactive: STATE.ACTIVE,
      },
    });

    if (!counselingTypeData) {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "Counseling type"));
    }

    const updates = {};

    if (counseling_type !== undefined) {
      updates.counseling_type = counseling_type;
    }

    if (counseling_type_code !== undefined) {
      const existingType = await counselingTypeModel.findOne({
        where: {
          isactive: STATE.ACTIVE,
          counseling_type_code,
          counseling_type_id: { [Op.ne]: counseling_type_id },
        },
      });

      if (existingType) {
        return send(
          res,
          setErrResMsg(
            RESPONSE.ALRDY_EXIST,
            "Entry with this counseling type code",
          ),
        );
      }

      updates.counseling_type_code = counseling_type_code;
    }

    if (description !== undefined) {
      updates.description = description;
    }

    if (isactive !== undefined) {
      updates.isactive = isactive;
    }

    await counselingTypeModel.update(updates, {
      where: {
        counseling_type_id,
      },
    });

    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log("update counseling type: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
