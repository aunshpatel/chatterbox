// src/sockets/socket.js
import { Server } from "socket.io";

let io;
let onlineUsers = {}; // { userId: socketId }

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // change to frontend URL in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

    // ===== User comes online =====
    socket.on("user-connected", (userId) => {
      onlineUsers[userId] = socket.id;
      io.emit("update-user-status", { userId, isOnline: true });
      console.log("Online users:", onlineUsers);
    });

    // ===== Join chat room =====
    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    // ===== Typing indicator =====
    socket.on("typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("typing", { chatId, userId });
    });

    // ===== Send message =====
    socket.on("send-message", async (messageData) => {
      try {
        const { chatId, senderId, content, mediaURL, messageType } = messageData;

        const Message = await import("../models/messageModel.js").then(m => m.default);
        const Chat = await import("../models/chatModel.js").then(m => m.default);

        const message = await Message.create({
          chat: chatId,
          sender: senderId,
          content,
          mediaURL,
          messageType,
        });

        await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id, updatedAt: new Date() });

        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "fullname phoneNumber avatarURL");

        io.to(chatId).emit("receive-message", populatedMessage);
      } catch (err) {
        console.error("Error in send-message socket:", err);
      }
    });

    // ===== Message Read Receipt =====
    socket.on("message-read", async ({ chatId, userId, messageIds }) => {
      try {
        const Message = await import("../models/messageModel.js").then(m => m.default);

        // Mark messages as read by this user
        await Message.updateMany(
          { _id: { $in: messageIds }, chat: chatId },
          { $addToSet: { readBy: userId } } // add userId to readBy array
        );

        // Notify other participants in the chat
        socket.to(chatId).emit("message-read", { chatId, userId, messageIds });
      } catch (err) {
        console.error("Error in message-read socket:", err);
      }
    });

    // ===== Disconnect =====
    socket.on("disconnect", () => {
      for (const [userId, socketId] of Object.entries(onlineUsers)) {
        if (socketId === socket.id) {
          delete onlineUsers[userId];
          io.emit("update-user-status", { userId, isOnline: false });
          break;
        }
      }
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};
