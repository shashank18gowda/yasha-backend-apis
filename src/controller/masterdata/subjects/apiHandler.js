import { Router } from "express";
import createSubject from "./createSubject.js";
import listSubject from "./listSubject.js";
import updateSubject from "./updateSubject.js";

const router = Router();

router.use("/create", createSubject);
router.use("/list", listSubject);
router.use("/update", updateSubject);

export default router;
