import express from "express";
// import { registerUser, loginUser, requestOTP, verifyOTP } from "../controllers/authController.js";
import { registerUser, requestOTP, verifyOTP, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post('/logout', protect, logout);

// router.post("/login", loginUser);

router.post('/request-otp', requestOTP);

router.post('/verify-otp', verifyOTP);

export default router;
