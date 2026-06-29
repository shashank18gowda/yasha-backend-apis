import { Router } from "express";
import createSubject from "./createSubject.js";

const router = Router();

router.use("/create", createSubject);

export default router;
