import { Router } from "express";
import { send, setErrResMsg } from "../../helper/responseHelper.js";
import { RESPONSE } from "../../config/global.js";
import { ROLE, STATE } from "../../config/constant.js";
import { getUserModel } from "../../model/users.js";
import CryptoJS from "crypto-js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";

const router = Router();

export default router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body || {};

    const userModel = await getUserModel();

    if (username == "" || username == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "username"));
    }
    if (password == "" || password == undefined) {
      return send(res, setErrResMsg(RESPONSE.REQUIRED, "password"));
    }

   

    let userData = await userModel.findOne({
      where: {
        isactive: STATE.ACTIVE,
        [Op.or]: [{ email: username }, { mobile: username }],
      },
    });

    if (userData) {
      const bytes = CryptoJS.AES.decrypt(
        userData.password,
        process.env.SECRET_KEY,
      );
      const decryptPassword = bytes.toString(CryptoJS.enc.Utf8);
      if (decryptPassword == password) {
        const token = jwt.sign(
          {
            id: userData.account_id,
            role: userData.role,
            name: userData.name,
            phone: userData.phone,
            email: userData.email,
          },
          process.env.TOKEN_KEY,
        );

        return send(res, RESPONSE.SUCCESS, {
          access_token: token,
        });
      } else {
        return send(res, setErrResMsg(RESPONSE.INVALID, "Login credential"));
      }
    } else {
      return send(res, setErrResMsg(RESPONSE.INVALID, "Login credential"));
    }
    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log("create admin: ", err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
