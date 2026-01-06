import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null,
  },
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  groupName: {
    type: String,
    default: "",
  },
  groupAvatar: {
    type: String,
    default: "",
  },
}, {
  timestamps: true,
});

/*** INDEXES * These are required for WhatsApp-style performance */
// Used to quickly find all chats of a user
chatSchema.index({ participants: 1 });

// Used to sort chats by latest activity
chatSchema.index({ updatedAt: -1 });

export default mongoose.model("Chat", chatSchema);