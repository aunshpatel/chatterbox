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

    // ===== Send message (text or media) =====
    socket.on("send-message", async (messageData) => {
      try {
        const { chatId, senderId, content = "", mediaURL = "", messageType = "text" } = messageData;

        const Message = await import("../models/messageModel.js").then(m => m.default);
        const Chat = await import("../models/chatModel.js").then(m => m.default);

        // Create message
        const message = await Message.create({
          chat: chatId,
          sender: senderId,
          content,
          mediaURL,
          messageType,
        });

        // Update last message in chat
        await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id, updatedAt: new Date() });

        // Populate sender info
        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "fullname phoneNumber avatarURL");

        // Emit to all participants in chat
        io.to(chatId).emit("receive-message", populatedMessage);

      } catch (err) {
        console.error("Error in send-message socket:", err);
      }
    });

    // ===== Message Read Receipt =====
    socket.on("message-read", async ({ chatId, userId, messageIds }) => {
      try {
        const Message = await import("../models/messageModel.js").then(m => m.default);
        await Message.updateMany(
          { _id: { $in: messageIds }, chat: chatId },
          { $addToSet: { readBy: userId } } // add userId to readBy array
        );
        // notify all participants except sender
        socket.to(chatId).emit("message-read", { chatId, userId, messageIds });
      } catch (err) {
        console.error("Error in message-read socket:", err);
      }
    });

    // ===== Group Chat Events =====

    // Create group
    socket.on("create-group", async ({ groupName, groupAvatar = "", creatorId, participantIds }) => {
      try {
        const Chat = await import("../models/chatModel.js").then(m => m.default);
        const participants = [creatorId, ...participantIds];

        const groupChat = await Chat.create({
          isGroupChat: true,
          groupName,
          groupAvatar,
          participants,
        });

        // Notify all participants
        participants.forEach(userId => {
          const socketId = onlineUsers[userId];
          if (socketId) io.to(socketId).emit("group-created", groupChat);
        });

      } catch (err) {
        console.error("Error creating group:", err);
      }
    });

    // Add participant to group
    socket.on("add-group-participant", async ({ chatId, userId }) => {
      try {
        const Chat = await import("../models/chatModel.js").then(m => m.default);
        const updatedChat = await Chat.findByIdAndUpdate(
          chatId,
          { $addToSet: { participants: userId } },
          { new: true }
        );
        io.to(chatId).emit("group-participant-added", { chatId, userId, updatedChat });
      } catch (err) {
        console.error("Error adding participant to group:", err);
      }
    });

    // Remove participant from group
    socket.on("remove-group-participant", async ({ chatId, userId }) => {
      try {
        const Chat = await import("../models/chatModel.js").then(m => m.default);
        const updatedChat = await Chat.findByIdAndUpdate(
          chatId,
          { $pull: { participants: userId } },
          { new: true }
        );
        io.to(chatId).emit("group-participant-removed", { chatId, userId, updatedChat });
      } catch (err) {
        console.error("Error removing participant from group:", err);
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
