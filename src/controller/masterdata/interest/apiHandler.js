import { Router } from "express";
import createInterest from "./createInterest.js";
import listInterest from "./listInterest.js";
// import updateInterest from "./updateInterest.js";

const router = Router();

router.use("/create", createInterest);
router.use("/list", listInterest);
// router.use("/update", updateInterest);

export default router;
