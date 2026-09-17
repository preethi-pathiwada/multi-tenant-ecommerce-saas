import express from "express";
import { createStore, getMyStore, getStoreBySlug, editStore , getAllStores} from "../controllers/storeController.js";
import {
  protect,
  authorize,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllStores);

router.get("/my-store" ,protect ,authorize("VENDOR") ,getMyStore);

router.post("/", protect, authorize("VENDOR"), createStore);

router.put("/my-store", protect, authorize("VENDOR"), editStore);

router.get("/:slug", getStoreBySlug);

export default router;