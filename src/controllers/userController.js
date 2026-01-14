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

// export const updateUser = async (req, res, next) => {
//   try {

//     // Update the user
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: {
//           fullname: req.body.fullname,
//           phoneNumber: req.body.phoneNumber,
//           avatarURL: req.body.avatarURL,
//           status: req.body.status,
//         },
//       },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return next(errorHandler(404, "User not found!"));
//     }

//     // Destructure password out
//     const { password, ...rest } = updatedUser._doc;

//     // Generate a new token (optional, or reuse the existing one)
//     // const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET);

//     // Send back user data and existing token
//     const existingToken = req.headers.authorization?.split(" ")[1]; // If frontend sends old token
//     res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       token: existingToken, // Preserve old token
//       user: rest
//     });

//   } catch (error) {
//     next(error);
//     // console.log("Error updating user: ", error);
//   }
// };

export const updateUser = async (req, res, next) => {
  try {
    let { fullname, phoneNumber, avatarURL, status } = req.body;

    // ✅ Fullname validation and trimming
    if (fullname !== undefined) {
      fullname = fullname.trim(); // remove leading/trailing spaces
      if (fullname === "") {
        return next(errorHandler(400, "Fullname cannot be empty"));
      }
    }
    // Trim status
    if (status !== undefined && typeof status === "string") {
      status = status.trim();
    }
    // Trim phoneNumber
    if (phoneNumber !== undefined && typeof phoneNumber === "string") {
      phoneNumber = phoneNumber.trim();
    }

    // Prepare updates, only include fields that are defined
    const updates = { fullname, phoneNumber, avatarURL, status };
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    // Find user and update
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found!"));
    }

    // Preserve existing token if provided
    const existingToken = req.headers.authorization?.split(" ")[1];

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      token: existingToken,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};