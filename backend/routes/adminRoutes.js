import express from "express";

import {getAdminDashboard, getAllVendors, toggleVendorStatus} from "../controllers/adminController.js";
import {protect, authorize} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, getAdminDashboard);
router.get("/vendors", protect, getAllVendors);
router.put("/vendors/:id/status",protect, toggleVendorStatus);

export default router;