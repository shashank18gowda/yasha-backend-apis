import { Router } from "express";
import { send, setErrResMsg } from "../../helper/responseHelper.js";
import { RESPONSE } from "../../config/global.js";
import { ROLE, STATE } from "../../config/constant.js";
import { getUserModel } from "../../model/users.js";
import authenticate from "../../helper/authenticate.js";

const router = Router();

export default router.get("/list", authenticate, async (req, res) => {
  try {
    const userModel = getUserModel();
    const trainers = await userModel.findAll({
      where: {
        role: ROLE.TRAINER,
        isactive: STATE.ACTIVE,
      },
      attributes: ["user_id", "first_name", "last_name", "email", "mobile"],
      order: [
        ["first_name", "ASC"],
        ["last_name", "ASC"],
      ],
    });

    if (trainers.length == 0) {
      return send(res, setErrResMsg(RESPONSE.NOT_FOUND, "Trainers"));
    }

    return send(res, RESPONSE.SUCCESS, trainers);
  } catch (err) {
    console.log("list counseling trainers: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
