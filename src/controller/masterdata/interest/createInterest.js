import { Router } from "express";
import { send, setErrResMsg } from "../../../helper/responseHelper.js";
import { RESPONSE } from "../../../config/global.js";
import { ROLE, STATE } from "../../../config/constant.js";
import { getinterestModel } from "../../../model/interests.js";
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
    const { interest_name, interest_code } = req.body || {};

    const interestModel = await getinterestModel();

    if (interest_name == "" || interest_name == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "interest_name"));
    }
    if (interest_code == "" || interest_code == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "interest_code"));
    }

    let isCodeExist = await interestModel.findOne({
      where: {
        isactive: STATE.ACTIVE,
        interest_code,
      },
    });

    let isInterestExist = await interestModel.findOne({
      where: {
        isactive: STATE.ACTIVE,
        interest_name,
      },
    });

    if (isCodeExist) {
      return send(
        res,
        setErrResMsg(RESPONSE.ALRDY_EXIST, "Entry with this interest code"),
      );
    }
    if (isInterestExist) {
      return send(
        res,
        setErrResMsg(RESPONSE.ALRDY_EXIST, "Entry with this interest_name"),
      );
    }

    await interestModel.create({
      interest_name,
      interest_code,
    });

    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log("create interest: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
