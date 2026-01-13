import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// Request OTP
export const requestOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).send("Phone number required");

    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
    await user.save();

    // TODO: Send OTP via SMS
    console.log(`OTP for ${phoneNumber} is ${otp}`);

    res.json({ success: true, otp:otp, message: `OTP ${otp} sent` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).send("User not found");

    if (user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).send("Invalid or expired OTP");
    }

    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, isRegistered: user.isRegistered, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Register
export const registerUser = async (req, res) => {
  try {
    const { token, fullname, avatarURL, status, isOnline, fcmToken } = req.body;
    if (!token) return res.status(401).json({ message: "Token missing" });

    // 1. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // 2. Find user
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 3. Update user data
    user.fullname = fullname || user.fullname;
    user.avatarURL = avatarURL || user.avatarURL;
    user.status = status || user.status;
    user.isOnline = isOnline || user.isOnline;
    user.fcmToken = fcmToken || user.fcmToken;

    user.isRegistered = true;
    user.otp = null;
    user.otpExpiresAt = null;
    user.lastSeenAt = new Date();

    await user.save();

    // 4. Generate a new permanent JWT
    const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // 5. Call the custom method directly on the document
    res.json({
      success: true,
      message: "Registration completed",
      user: user,
      token: newToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res, next) => {
  if(req.user.id !== req.params.id ) return next(errorHandler(401, 'You can only delete your own account!'));
  try{
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted successfully!');
  } catch(error) {
    next(error);
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}