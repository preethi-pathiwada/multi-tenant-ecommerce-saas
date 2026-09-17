import express from "express"

import { registerUser, loginUser, logoutUser, verifyEmail, resendVerificationEmail, googleLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/google", googleLogin);

export default router;



