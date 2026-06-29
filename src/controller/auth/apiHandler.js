import { Router } from "express";
import login from "./login.js";
import createAdmin from "./createAdmin.js";

const router = Router();

router.use("/login", login);
router.use("/create-admin", createAdmin);

export default router;
