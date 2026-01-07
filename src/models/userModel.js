import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  fullname: { 
    type: String,
    default: '',
  },
  phoneNumber: { 
    type: String,
    required: true,
    unique: true,
    default: '',
  },
  avatarURL: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: '', 
  },
  isOnline: { 
    type: Boolean,
    default: false,
  },
  lastSeenAt: {
    type: Date,
    default: Date.now,
  },
  fcmToken: { 
    type: String,
  },
  isRegistered: {
    type: Boolean,
    default: false 
  },
  otp: {
    type: Number,
    default: 0,
  },
  otpExpiresAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);