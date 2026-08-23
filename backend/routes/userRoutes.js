import express from "express";
import {protect, authorize} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "You accessed a protected route",
    user: req.user,
  });
});



router.get("/vendor-test", protect, authorize("VENDOR"), (req, res) => {
  res.status(200).json({
    message:"Welcome VENOR"
  })
});

router.get("/admin-test", protect, authorize("ADMIN"), (req, res) => {
  res.status(200).json({
    message:"Welcome ADMIN"
  })
});

router.get("/customer-test", protect, authorize("CUSTOMER"), (req, res) => {
  res.status(200).json({
    message:"Welcome CUSTOMER"
  })
});

export default router;