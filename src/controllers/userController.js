import User from "../models/userModel.js";
import errorHandler from "../utils/errorHandler.js";

export const updateFCMToken = async (req, res) => {
  const userId = req.user?.id; // protect middleware must attach req.user
  const { deviceId, fcmToken } = req.body;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!deviceId || !fcmToken) {
    return res.status(400).json({
      success: false,
      message: "deviceId and fcmToken are required",
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const existingDeviceIndex = user.devices.findIndex(d => d.deviceId === deviceId);

    if (existingDeviceIndex !== -1) {
      // ✅ Update existing device
      user.devices[existingDeviceIndex].fcmToken = fcmToken;
      user.devices[existingDeviceIndex].lastUsedAt = new Date();
    } else {
      // ✅ Add new device
      if (user.devices.length >= 5) {
        // Keep only 5 most recent devices
        user.devices.sort((a, b) => new Date(a.lastUsedAt) - new Date(b.lastUsedAt));
        user.devices.shift();
      }
      user.devices.push({
        deviceId,
        fcmToken,
        lastUsedAt: new Date(),
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Device token updated successfully",
      devices: user.devices, // optional: send updated list
    });
  } catch (error) {
    console.error("Error updating device token:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// export const updateFCMToken = async (req, res) => {
//   const userId = req.user.id;
//   const { deviceId, fcmToken } = req.body;

//   if (!deviceId || !fcmToken) {
//     return res.status(400).json({
//       success: false,
//       message: "deviceId and fcmToken are required",
//     });
//   }

//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const existingDeviceIndex = user.devices.findIndex(
//       (d) => d.deviceId === deviceId
//     );

//     if (existingDeviceIndex !== -1) {
//       user.devices[existingDeviceIndex].fcmToken = fcmToken;
//       user.devices[existingDeviceIndex].lastUsedAt = new Date();
//     } else {
//       if (user.devices.length >= 5) {
//         user.devices.sort(
//           (a, b) => new Date(a.lastUsedAt) - new Date(b.lastUsedAt)
//         );
//         user.devices.shift();
//       }

//       user.devices.push({
//         deviceId,
//         fcmToken,
//         lastUsedAt: new Date(),
//       });
//     }

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Device token updated successfully",
//     });
//   } catch (error) {
//     console.error("Error updating device token:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

export const getUserByID = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user) return next(errorHandler(404, 'User not found!'));
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    let { fullname, phoneNumber, avatarURL, status } = req.body;

    if (fullname !== undefined) {
      fullname = fullname.trim();
      if (fullname === "") {
        return next(errorHandler(400, "Fullname cannot be empty"));
      }
    }

    if (status !== undefined && typeof status === "string") {
      status = status.trim();
    }

    if (phoneNumber !== undefined && typeof phoneNumber === "string") {
      phoneNumber = phoneNumber.trim();
    }

    const updates = { fullname, phoneNumber, avatarURL, status };
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found!"));
    }

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