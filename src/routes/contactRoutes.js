import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registeredUsers } from "../controllers/contactController.js";

const router = express.Router();

// POST /api/contacts/contacts-check
router.post("/contacts-check", protect, registeredUsers);

export default router;
