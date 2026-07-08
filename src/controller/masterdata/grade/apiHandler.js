import { Router } from "express";
import createGrade from "./createGrade.js";
import listGrade from "./listGrade.js";
// import updateGrade from "./updateGrade.js";

const router = Router();

router.use("/create", createGrade);
router.use("/list", listGrade);
// router.use("/update", updateGrade);

export default router;
