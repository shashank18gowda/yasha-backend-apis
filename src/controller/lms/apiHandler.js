import { Router } from "express";
import videoApiHandler from "./videos/apiHandler.js";
import completionApiHandler from "./completions/apiHandler.js";
import liveClassApiHandler from "./liveClasses/apiHandler.js";

const router = Router();

router.use("/videos", videoApiHandler);
router.use("/completions", completionApiHandler);
router.use("/live-classes", liveClassApiHandler);

export default router;
