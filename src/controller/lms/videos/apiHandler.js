import { Router } from "express";
import createVideo from "./createVideo.js";
import listVideos from "./listVideos.js";
import updateVideo from "./updateVideo.js";

const router = Router();

router.use("/create", createVideo);
router.use("/list", listVideos);
router.use("/update", updateVideo);

export default router;
