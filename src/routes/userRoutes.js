import express from "express";
import { updateFCMToken } from "../controllers/userController.js";

router.post('/users/:userId/update-fcm', updateFCMToken);

export default router;