import { Router } from "express";
import createBooking from "./createBooking.js";
import listBookings from "./listBookings.js";

const router = Router();

router.use("/create", createBooking);
router.use("/list", listBookings);

export default router;
