import express from "express";
import { updateFCMToken } from "../controllers/userController.js";
// import { registerUser, loginUser, requestOTP, verifyOTP } from "../controllers/authController.js";


router.post('/users/:userId/update-fcm', updateFCMToken);

export default router;