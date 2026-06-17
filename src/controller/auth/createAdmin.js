import { Router } from "express";
import { send, setErrResMsg } from "../../helper/responseHelper.js";
import { RESPONSE } from "../../config/global.js";
import { ROLE, STATE } from "../../config/constant.js";
import { getUserModel } from "../../model/users.js";
import CryptoJS from "crypto-js";

const router = Router();

export default router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, mobile, email, password, confirm_password } =
      req.body || {};

    const userModel = getUserModel();

    if (first_name == "" || first_name == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "first_name"));
    }
    if (last_name == "" || last_name == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "last_name"));
    }
    if (mobile == "" || mobile == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "mobile"));
    }
    if (email == "" || email == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "email"));
    }
    if (password == "" || password == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "password"));
    }
    if (confirm_password == "" || confirm_password == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "confirm_password"));
    }

    if (password != confirm_password) {
      return send(
        res,
        setErrResMsg(RESPONSE.NOT_MATCH, "Password & confirm password"),
      );
    }

    const emailPattern = String(email).match(
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    );

    if (!emailPattern) {
      return send(res, setErrResMsg(RESPONSE.INVALID, "Email"));
    }

    const pPattern = String(mobile).match(/^\+\d{10,15}$/);
    if (!pPattern) {
      return send(res, setErrResMsg(RESPONSE.INVALID, "mobile"));
    }

    const pwdPattern = String(password).match(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{6,32}$/,
    );
    if (!pwdPattern) {
      return send(res, setErrResMsg(RESPONSE.INVALID, "password pattern"));
    }

    let ismobileExist = await userModel.findOne({
      where: {
        isactive: STATE.ACTIVE,
        mobile,
      },
    });

    let isemailExist = await userModel.findOne({
      where: {
        isactive: STATE.ACTIVE,
        email,
      },
    });

    if (ismobileExist) {
      return send(
        res,
        setErrResMsg(RESPONSE.ALRDY_EXIST, "Entry with this mobile"),
      );
    }
    if (isemailExist) {
      return send(
        res,
        setErrResMsg(RESPONSE.ALRDY_EXIST, "Entry with this email"),
      );
    }

    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET_KEY,
    ).toString();

    await userModel.create({
      ...req.body,
      password: encryptedPassword,
      role: ROLE.ADMIN,
    });

    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log("create admin: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
