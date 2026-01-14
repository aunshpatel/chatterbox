import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { updateFCMToken, getUserByID } from "../controllers/userController.js";

const router = express.Router();

router.post('/users/:userId/update-fcm', protect, updateFCMToken);

router.get('/get-user/:id', protect, getUserByID);

router.push('/update/:id', protect, updateUser);

export default router;