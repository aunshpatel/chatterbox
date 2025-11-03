import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createOrGetChat, getMyChats } from "../controllers/chatController.js";

const router = express.Router();

router.post("/create-get-chat", protect, createOrGetChat);
router.get("/get-my-chat", protect, getMyChats);

export default router;
