import { Router } from "express";
import markVideoCompleted from "./markVideoCompleted.js";

const router = Router();

router.use("/mark-video-completed", markVideoCompleted);

export default router;
