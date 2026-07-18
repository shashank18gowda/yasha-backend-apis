import { Router } from "express";
import counselingTypeApiHandler from "./types/apiHandler.js";
import counselingSlotApiHandler from "./slots/apiHandler.js";
import counselingBookingApiHandler from "./bookings/apiHandler.js";
import trainers from "./trainers.js";

const router = Router();

router.use("/types", counselingTypeApiHandler);
router.use("/slots", counselingSlotApiHandler);
router.use("/bookings", counselingBookingApiHandler);
router.use("/trainers", trainers);

export default router;
