import express from "express";
import { updateFCMToken } from "../controllers/userController.js";

const router = express.Router();

router.post('/users/:userId/update-fcm', updateFCMToken);

export default router;