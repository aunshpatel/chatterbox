import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

// Create or get a chat between two users
export const createOrGetChat = async (req, res) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId) return res.status(400).json({ message: "Receiver required" });

    // Check if chat exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, receiverId] },
      isGroupChat: false,
    }).populate("participants", "fullname phoneNumber avatarURL");

    // If not, create a new chat
    if (!chat) {
      chat = new Chat({
        participants: [req.user._id, receiverId],
      });
      await chat.save();
      chat = await Chat.findById(chat._id).populate("participants", "fullname phoneNumber avatarURL");
    }

    res.json({ success: true, chat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all chats for logged-in user
export const getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate("participants", "fullname phoneNumber avatarURL isOnline lastSeenAt")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json({ success: true, chats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
