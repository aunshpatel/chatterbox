import express from "express";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import logger from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";

import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js'
import chatRoutes from './src/routes/chatRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';
import contactsRouter from './src/routes/contactRoutes.js';
import { initSocket } from './src/sockets/socket.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// ------ Middleware ------
app.use(cors());
app.use(logger("dev"));
app.use(express.json());

// ------ MongoDB connection ------
mongoose.connect(process.env.MONGO_URI).then(() => console.log("✅ Connected to MongoDB")).catch(err => console.error("❌ MongoDB connection error:", err));

// ------ API routes ------
app.get("/api", (req, res) => {
  res.json({ message: "Hello from Chatterbox backend!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/contacts", contactsRouter);

// ------ Serve frontend SPA ------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from "dist"
app.use(express.static(path.join(__dirname, "dist")));

// Catch-all route for SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ------ Initialize Socket.io ------
const io = initSocket(httpServer);

// Optional: make `io` accessible globally (for emitting outside socket file if needed)
app.set("io", io);

// ------ Start the server ------
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});