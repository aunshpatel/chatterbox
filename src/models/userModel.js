// import mongoose from "mongoose";
// const Schema = mongoose.Schema;

// const userSchema = Schema({
//   fullname:{
//     type: String,
//   },
//   phoneNumber:{
//     type: String,
//     required:true,
//     unique:true,
//   },
//   avatarURL:{
//     type: String,
//   },
//   status:{
//     type: String,
//   },
//   isOnline:{
//     type: String,
//   },
//   lastSeenAt:{
//     type:Date
//   },
//   fcmTokens: {
//     type: [String],
//     default: [],
//   },
//   isRegistered:{
//     type: Boolean,
//     default: false
//   },
//   otp: { 
//     type: String 
//   }, // Last sent OTP
//   otpExpiresAt: { 
//     type: Date 
//   }, // Expiry of OTP
// }, {
//   timestamps:true,
// });

// userSchema.set("toJSON", {
//   transform: function (doc, ret) {
//     return {
//       fullname: ret.fullname,
//       phoneNumber: ret.phoneNumber,
//       avatarURL: ret.avatarURL,
//       status: ret.status,
//       isOnline: ret.isOnline,
//       lastSeenAt: ret.lastSeenAt,
//       fcmTokens: ret.fcmTokens,
//       isRegistered: ret.isRegistered,
//       otp: ret.otp,
//       otpExpiresAt: ret.otpExpiresAt
//     };
//   }
// });

// const User = mongoose.model('User', userSchema);

// export default User;

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
    type: String,
    default: '', 
  },
  lastSeenAt: {
    type: Date,
    default: Date.now,
  },
  fcmTokens: { 
    type: [String],
    default: []
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

// ✅ Custom ordered JSON method
// userSchema.methods.toOrderedJSON = function () {
//   return {
//     fullname: this.fullname,
//     phoneNumber: this.phoneNumber,
//     avatarURL: this.avatarURL,
//     status: this.status,
//     isOnline: this.isOnline,
//     lastSeenAt: this.lastSeenAt,
//     fcmTokens: this.fcmTokens,
//     isRegistered: this.isRegistered,
//     otp: this.otp,
//     otpExpiresAt: this.otpExpiresAt
//   };
// };

export default mongoose.model("User", userSchema);
