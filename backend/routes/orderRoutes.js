import express from "express";
import {createOrder, createRazorpayOrder, verifyRazorpayPayment, getVendorOrders} from "../controllers/orderController.js";

import {protect, authorize} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/",protect, authorize("CUSTOMER"), createOrder);
router.post("/payment/create", protect, authorize("CUSTOMER"), createRazorpayOrder);
router.post("/payment/verify", protect, authorize("CUSTOMER"),verifyRazorpayPayment);
router.get("/vendor", protect, authorize("VENDOR"), getVendorOrders);

export default router;