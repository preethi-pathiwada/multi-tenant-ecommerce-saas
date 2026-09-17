import express from "express";
import {protect, authorize} from "../middlewares/authMiddleware.js";
import { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from "../controllers/addressController.js";

const router = express.Router();

router.get("/", protect, authorize("CUSTOMER"), getAddresses)
router.post("/", protect, authorize("CUSTOMER"), createAddress);
router.put("/:id", protect, authorize("CUSTOMER"), updateAddress);
router.delete("/:id", protect, authorize("CUSTOMER"), deleteAddress);
router.patch("/:id/default", protect, authorize("CUSTOMER"), setDefaultAddress);


export default router;
