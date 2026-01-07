import Chat from "../models/chatModel.js";
import Contact from "../models/contactModel.js";
import { formatChatTime } from "../utils/formatChatTime.js";

// Create or get a chat between two users
export const createOrGetChat = async (req, res) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId) return res.status(400).json({ message: "Receiver required" });

    // 1️⃣ Check if a chat already exists between the two users
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, receiverId] },
      isGroupChat: false,
    }).populate("participants", "fullname phoneNumber avatarURL");

    // 2️⃣ If no chat exists, create a new one
    if (!chat) {
      chat = new Chat({
        participants: [req.user._id, receiverId],
      });
      await chat.save();

      // Re-populate participants after saving
      chat = await Chat.findById(chat._id).populate(
        "participants",
        "fullname phoneNumber avatarURL"
      );
    }

    res.json({ success: true, chat });
  } catch (err) {
    console.error("Error in createOrGetChat:", err);
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

// export const getChatList = async (req, res) => {
//   try {
//     const userId = req.user._id.toString();
//     const search = req.query.search ? req.query.search.trim().toLowerCase() : null;

//     // 1️⃣ Load user's contacts
//     const contacts = await Contact.find({ ownerUserId: userId });
//     const contactMap = new Map();
//     contacts.forEach(c => {
//       contactMap.set(c.phoneNumber, c.savedName);
//     });

//     // 2️⃣ Fetch chats
//     const chats = await Chat.find({ participants: userId }).populate("participants", "fullname phoneNumber avatarURL")
//     .populate({
//       path: "lastMessage",
//       populate: {
//         path: "sender",
//         select: "fullname phoneNumber",
//       },
//     }).sort({ updatedAt: -1 });

//     const results = [];

//     for (const chat of chats) {
//       let displayName = "";
//       let avatarURL = "";
//       let displaySubName = null;
//       let lastMessageText = "";
//       let lastMessageTime = "";

//       // PRIVATE CHAT
//       if (!chat.isGroupChat) {
//         const otherUser = chat.participants.find(
//           p => p._id.toString() !== userId
//         );

//         displayName = contactMap.get(otherUser.phoneNumber) || otherUser.fullname || otherUser.phoneNumber;
//         avatarURL = otherUser.avatarURL;
//       }

//       // GROUP CHAT
//       if (chat.isGroupChat) {
//         displayName = chat.groupName;
//         avatarURL = chat.groupAvatar;
//       }

//       // LAST MESSAGE
//       if (chat.lastMessage) {
//         lastMessageText = chat.lastMessage.content || "";
//         lastMessageTime = formatChatTime(chat.lastMessage.createdAt);

//         if (chat.isGroupChat && search) {
//           const sender = chat.lastMessage.sender;
//           const senderName = contactMap.get(sender.phoneNumber) || sender.fullname || sender.phoneNumber;
//           displaySubName = `${senderName}: ${lastMessageText}`;
//         }
//       }

//       // SEARCH FILTER
//       if (search) {
//         const nameMatch = displayName.toLowerCase().includes(search);
//         const msgMatch = lastMessageText.toLowerCase().includes(search);
//         if (!nameMatch && !msgMatch) continue;
//       }

//       results.push({
//         chatId: chat._id,
//         isGroupChat: chat.isGroupChat,
//         displayName,
//         displaySubName,
//         avatarURL,
//         lastMessage: lastMessageText,
//         lastMessageTime,
//       });
//     }

//     if (search) {
//       results.sort((a, b) => a.displayName.localeCompare(b.displayName));
//     }

//     res.json({ success: true, chats: results });
//   } catch (error) {
//     console.error("Chat list error:", error);
//     res.status(500).json({ message: "Failed to fetch chat list" });
//   }
// };


export const getChatList = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const search = req.query.search?.trim().toLowerCase() || null;

    // 1️⃣ Load contacts
    const contacts = await Contact.find({ ownerUserId: userId });
    const contactMap = new Map();
    contacts.forEach(c => contactMap.set(c.phoneNumber, c.savedName));

    // 2️⃣ Fetch chats
    const chats = await Chat.find({ participants: userId }).populate("participants", "fullname phoneNumber avatarURL")
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "fullname phoneNumber" }
    }).sort({ updatedAt: -1 });

    let messageMatches = new Map();

    // 3️⃣ If searching, find matching messages
    if (search) {
      const matchedMessages = await Message.find({
        content: { $regex: search, $options: "i" },
        deletedFor: { $ne: userId }
      }).populate("sender", "fullname phoneNumber").sort({ createdAt: -1 });

      for (const msg of matchedMessages) {
        if (!messageMatches.has(msg.chat.toString())) {
          messageMatches.set(msg.chat.toString(), msg);
        }
      }
    }

    const results = [];

    for (const chat of chats) {
      let displayName = "";
      let avatarURL = "";
      let previewText = "";
      let previewTime = "";
      let isMatch = false;

      // PRIVATE CHAT
      if (!chat.isGroupChat) {
        const otherUser = chat.participants.find(p => p._id.toString() !== userId);

        displayName = contactMap.get(otherUser.phoneNumber) || otherUser.fullname || otherUser.phoneNumber;

        avatarURL = otherUser.avatarURL;
      }

      // GROUP CHAT
      if (chat.isGroupChat) {
        displayName = chat.groupName;
        avatarURL = chat.groupAvatar;
      }

      // MESSAGE MATCH HAS PRIORITY
      const matchedMessage = messageMatches.get(chat._id.toString());

      if (matchedMessage) {
        isMatch = true;
        previewTime = formatChatTime(matchedMessage.createdAt);

        if (chat.isGroupChat) {
          const senderName = contactMap.get(matchedMessage.sender.phoneNumber) || matchedMessage.sender.fullname ||  matchedMessage.sender.phoneNumber;

          previewText = `${senderName}: ${matchedMessage.content}`;
        } else {
          previewText = matchedMessage.content;
        }
      }
      // FALLBACK TO LAST MESSAGE
      else if (chat.lastMessage) {
        previewText = chat.lastMessage.content || "";
        previewTime = formatChatTime(chat.lastMessage.createdAt);
      }

      // SEARCH FILTER
      if (search) {
        const nameMatch = displayName.toLowerCase().includes(search);
        if (!nameMatch && !matchedMessage) continue;
      }

      results.push({
        chatId: chat._id,
        isGroupChat: chat.isGroupChat,
        displayName,
        avatarURL,
        lastMessage: previewText,
        lastMessageTime: previewTime,
        matched: isMatch
      });
    }

    // 4️⃣ Sorting rules (WhatsApp behavior)
    if (search) {
      results.sort((a, b) => {
        if (a.matched !== b.matched) return b.matched - a.matched;
        return a.displayName.localeCompare(b.displayName);
      });
    }

    res.json({ success: true, chats: results });
  } catch (error) {
    console.error("Chat list search error:", error);
    res.status(500).json({ message: "Failed to fetch chat list" });
  }
};