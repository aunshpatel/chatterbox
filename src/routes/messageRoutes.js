import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage, getMessages, deleteMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post("/send-message", protect, sendMessage);
router.get("/:chatId", protect, getMessages);
router.delete("/delete-message", protect, deleteMessage);

export default router;