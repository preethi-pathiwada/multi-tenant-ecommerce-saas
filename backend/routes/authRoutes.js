import express from "express"

import { registerUser, loginUser, logoutUser, verifyEmail, resendVerificationEmail, googleLogin, getCurrentUser } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/google", googleLogin);
router.get("/me", protect, getCurrentUser);

export default router;



