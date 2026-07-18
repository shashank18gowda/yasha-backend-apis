import { Router } from "express";
import createLiveClass from "./createLiveClass.js";
import listLiveClasses from "./listLiveClasses.js";
import updateLiveClass from "./updateLiveClass.js";

const router = Router();

router.use("/create", createLiveClass);
router.use("/list", listLiveClasses);
router.use("/update", updateLiveClass);

export default router;
