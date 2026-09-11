import express from "express";


import { createProduct, getMyProducts, getStoreProducts, updateProduct, deleteProduct, getProductById} from "../controllers/productController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("VENDOR"), upload.array("images", 5), createProduct);
router.get("/my-store", protect, authorize("VENDOR"), getMyProducts);
router.get("/store/:storeId",getStoreProducts);
router.put("/:productId", protect, authorize("VENDOR"), upload.array("images", 5), updateProduct);
router.delete("/:productId", protect, authorize("VENDOR"), deleteProduct);
router.get("/:productId", getProductById);

export default router;


