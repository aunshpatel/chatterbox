import User from "../models/userModel.js";

// Update FCM Token
export const updateFCMToken = async (req, res) => {
  const { userId } = req.params;
  const { fcmToken } = req.body;

  if (!fcmToken) {
    return res.status(400).json({ success: false, message: 'fcmToken is required' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.fcmToken = fcmToken;
    await user.save();

    return res.status(200).json({ success: true, message: 'FCM token updated successfully' });
  } catch (error) {
    console.error('Error updating FCM token:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}


export const getUserByID = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user) return next(errorHandler(404, 'User not found!'));
    res.status(200).json(user);
  } catch (error) {
      next(error);
  }
}