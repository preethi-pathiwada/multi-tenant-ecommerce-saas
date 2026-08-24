import express from "express";
import { createStore, getMyStore, getStoreBySlug } from "../controllers/storeController.js";
import {
  protect,
  authorize,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("VENDOR"),
  createStore
);

router.get(
  "/my-store",
  protect,
  authorize("VENDOR"),
  getMyStore
);

router.get("/:slug", getStoreBySlug)

export default router;