import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  ownerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  savedName: {
    type: String,
    required: true
  }
}, { timestamps: true });

contactSchema.index({ ownerUserId: 1, phoneNumber: 1 });

export default mongoose.model("Contact", contactSchema);