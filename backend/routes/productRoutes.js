import express from "express";


import { createProduct, getMyProducts, getStoreProducts, updateProduct, deleteProduct, getProductById} from "../controllers/productController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("VENDOR"), createProduct);
router.get("/my-store", protect, authorize("VENDOR"), getMyProducts);
router.get("/store/:storeId",getStoreProducts);
router.put("/:productId", protect, authorize("VENDOR"), updateProduct);
router.delete("/:productId", protect, authorize("VENDOR"), deleteProduct);
router.get("/:productId", getProductById);

export default router;


