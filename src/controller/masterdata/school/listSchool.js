import { Router } from "express";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getschoolModel } from "../../../model/schools.js";
import authenticate from "../../../helper/authenticate.js";
import { Op } from "sequelize";
import { getUserModel } from "../../../model/users.js";

const router = Router();

export default router.get("/", authenticate, async (req, res) => {
  try {
    let query = {
      isactive: STATE.ACTIVE,
    };
    const userModel = await getUserModel();

    req.query.searchkey
      ? (query.school_name = { [Op.iLike]: `${req.query.searchkey}%` })
      : "";

    const schoolModel = await getschoolModel();

    let schoolData = await schoolModel.findAll({

      include: [
        {
          model: userModel,
          as: "createdBy",
          attributes: ["user_id", "first_name", "last_name", "email"],
        },
      ],
      where: query,
      attributes: [
        "school_id",
        "school_name",
        "school_code",
        "board",
        "school_type",
        "medium_of_instruction",
        "category",
        "principal_name",
        "school_email",
        "school_phone",
        "address",
        "city",
        "district",
        "state",
        "country",
        "pincode",
        "created_by",
        "createdAt",
      ],

      order: [["createdAt", "DESC"]],
    });

    if (schoolData.length == 0) {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "schools"));
    }

    return send(res, RESPONSE.SUCCESS, schoolData);
  } catch (err) {
    console.log("list school: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
