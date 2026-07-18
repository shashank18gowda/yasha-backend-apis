import { Router } from "express";
import createSlot from "./createSlot.js";
import listSlots from "./listSlots.js";

const router = Router();

router.use("/create", createSlot);
router.use("/list", listSlots);

export default router;
