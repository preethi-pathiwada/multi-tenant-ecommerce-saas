import express from "express";
import {createOrder, createRazorpayOrder} from "../controllers/orderController.js";

import {protect, authorize} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/",protect, authorize("CUSTOMER"), createOrder);
router.post("/payment/create", protect, authorize("CUSTOMER"), createRazorpayOrder);

export default router;