import { Router } from "express";
import createSchool from "./createSchool.js";
import listSchool from "./listSchool.js";
// import updateSubject from "./updateSubject.js";

const router = Router();

router.use("/create", createSchool);
router.use("/list", listSchool);
// router.use("/update", updateSubject);

export default router;
