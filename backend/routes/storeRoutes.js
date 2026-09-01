import express from "express";
import { createStore, getMyStore, getStoreBySlug, editStore } from "../controllers/storeController.js";
import {
  protect,
  authorize,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("VENDOR"), createStore);

router.get("/my-store" ,protect ,authorize("VENDOR") ,getMyStore);

router.get("/:slug", getStoreBySlug);

router.put("/my-store", protect, authorize("VENDOR"), editStore);

export default router;