import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registerUser, requestOTP, verifyOTP, logout, deleteUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post('/logout', protect, logout);

// router.post("/login", loginUser);

router.post('/request-otp', requestOTP);

router.post('/verify-otp', verifyOTP);

router.delete('/delete/:id', protect, deleteUser);

export default router;
