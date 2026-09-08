import express from "express";

import {getAdminDashboard, getAllVendors} from "../controllers/adminController.js";
import {protect, authorize} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, getAdminDashboard);
router.get("/vendors", protect, getAllVendors);

export default router;