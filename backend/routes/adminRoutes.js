import express from "express";

import {
  getAdminDashboard,

  getAllVendors,
  toggleVendorStatus,

  getAllCustomers,
  toggleCustomerStatus,

  getAllStores,
  getAdminStoreById,

  getAllProducts,
  getAdminProductById,

  getAllOrders,
  getAdminOrderById,
} from "../controllers/adminController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();


/* =========================================================
   DASHBOARD
   ========================================================= */

router.get(
  "/dashboard",
  protect,
  authorize("SUPER_ADMIN"),
  getAdminDashboard
);


/* =========================================================
   VENDORS
   ========================================================= */

router.get(
  "/vendors",
  protect,
  authorize("SUPER_ADMIN"),
  getAllVendors
);

router.put(
  "/vendors/:id/status",
  protect,
  authorize("SUPER_ADMIN"),
  toggleVendorStatus
);


/* =========================================================
   CUSTOMERS
   ========================================================= */

router.get(
  "/customers",
  protect,
  authorize("SUPER_ADMIN"),
  getAllCustomers
);

router.put(
  "/customers/:id/status",
  protect,
  authorize("SUPER_ADMIN"),
  toggleCustomerStatus
);


/* =========================================================
   STORES
   ========================================================= */

router.get(
  "/stores",
  protect,
  authorize("SUPER_ADMIN"),
  getAllStores
);

router.get(
  "/stores/:id",
  protect,
  authorize("SUPER_ADMIN"),
  getAdminStoreById
);


/* =========================================================
   PRODUCTS
   ========================================================= */

router.get(
  "/products",
  protect,
  authorize("SUPER_ADMIN"),
  getAllProducts
);

router.get(
  "/products/:id",
  protect,
  authorize("SUPER_ADMIN"),
  getAdminProductById
);


/* =========================================================
   ORDERS
   ========================================================= */

router.get(
  "/orders",
  protect,
  authorize("SUPER_ADMIN"),
  getAllOrders
);

router.get(
  "/orders/:id",
  protect,
  authorize("SUPER_ADMIN"),
  getAdminOrderById
);


export default router;