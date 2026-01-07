import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registeredUsers } from "../controllers/contactController.js";

const router = express.Router();

// POST /api/contacts/registered
// Body: { phoneNumbers: ["1234567890", "9876543210"] }
router.post("/registered", protect, registeredUsers);

export default router;
