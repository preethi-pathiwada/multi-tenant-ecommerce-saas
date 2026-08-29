import express from "express";
import {createOrder, createRazorpayOrder, verifyRazorpayPayment} from "../controllers/orderController.js";

import {protect, authorize} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/",protect, authorize("CUSTOMER"), createOrder);
router.post("/payment/create", protect, authorize("CUSTOMER"), createRazorpayOrder);
router.post("/payment/verify", protect, authorize("CUSTOMER"),verifyRazorpayPayment);

export default router;