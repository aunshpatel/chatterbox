import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { chatId, content, mediaURL, messageType } = req.body;
    if (!chatId) return res.status(400).json({ message: "chatId required" });

    const message = await Message.create({ chat: chatId, sender: req.user._id, content, mediaURL, messageType });

    // Update last message in chat
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id, updatedAt: new Date() });

    const populatedMessage = await Message.findById(message._id).populate("sender", "fullname phoneNumber avatarURL").populate("chat");

    res.json({ success: true, message: populatedMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get messages for a chat
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { limit = 30, skip = 0 } = req.query;

    const messages = await Message.find({ chat: chatId, deletedFor: { $ne: req.user._id } }).populate("sender", "fullname avatarURL").sort({ createdAt: -1 }).skip(parseInt(skip)).limit(parseInt(limit));

    res.json({ success: true, messages: messages.reverse() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete message (for me / for everyone)
export const deleteMessage = async (req, res) => {
  try {
    const { messageId, forEveryone } = req.body;
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (forEveryone) {
      await Message.findByIdAndDelete(messageId);
    } else {
      message.deletedFor.push(req.user._id);
      await message.save();
    }

    res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
