import { Router } from "express";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getschoolModel } from "../../../model/schools.js";
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
    const {
      school_name,
      school_code,
      board,
      school_type,
      medium_of_instruction,
      category,
      principal_name,
      school_email,
      school_phone,
      address,
      city,
      district,
      state,
      country,
      pincode,
    } = req.body || {};

    const schoolModel = await getschoolModel();

    if (school_name == "" || school_name == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "school_name"));
    }
    if (school_code == "" || school_code == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "school_code"));
    }
    if (board == "" || board == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "board"));
    }
    if (school_type == "" || school_type == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "school_type"));
    }
    if (medium_of_instruction == "" || medium_of_instruction == undefined) {
      return send(
        res,
        setErrResMsg(RESPONSE.REQUIRED, "medium_of_instruction"),
      );
    }
    if (category == "" || category == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "category"));
    }
    if (principal_name == "" || principal_name == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "principal_name"));
    }
    if (school_email == "" || school_email == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "school_email"));
    }
    if (school_phone == "" || school_phone == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "school_phone"));
    }
    if (address == "" || address == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "address"));
    }
    if (pincode == "" || pincode == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "pincode"));
    }
    if (city == "" || city == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "city"));
    }
    if (district == "" || district == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "district"));
    }
    if (country == "" || country == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "country"));
    }
    if (state == "" || state == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "state"));
    }

    const emailPattern = String(school_email).match(
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    );

    if (!emailPattern) {
      return send(res, setErrResMsg(RESPONSE.INVALID, "Email"));
    }

    const pPattern = String(school_phone).match(/^\+\d{10,15}$/);
    if (!pPattern) {
      return send(res, setErrResMsg(RESPONSE.INVALID, "school_phone"));
    }

    let isCodeExist = await schoolModel.findOne({
      where: {
        isactive: STATE.ACTIVE,
        school_code,
      },
    });

    if (isCodeExist) {
      return send(
        res,
        setErrResMsg(RESPONSE.ALRDY_EXIST, "Entry with this school code"),
      );
    }


    await schoolModel.create({
      ...req.body,
      created_by: req.user.id,
    });

    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log("create school: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
