import { Router } from "express";
import createCounselingType from "./createCounselingType.js";
import listCounselingTypes from "./listCounselingTypes.js";
import updateCounselingType from "./updateCounselingType.js";

const router = Router();

router.use("/create", createCounselingType);
router.use("/list", listCounselingTypes);
router.use("/update", updateCounselingType);

export default router;
