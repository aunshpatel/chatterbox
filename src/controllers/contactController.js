import { log } from "console";
import User from "../models/userModel.js";

export const registeredUsers = async (req, res) => {
  try {
    const { phoneNumbers } = req.body;

    if (!Array.isArray(phoneNumbers)) {
      return res.status(400).json({ message: "phoneNumbers must be an array" });
    }

    console.log(`phoneNumbers:${phoneNumbers}`);

    // Normalize phone numbers: remove spaces and optional '+' at start
    const normalizedPhones = phoneNumbers.map(num =>
      num.replace(/\s+/g, "").replace(/^\+/, "")
    );

    console.log(`normalizedPhones:${normalizedPhones}`)

    // Fetch only users who are registered and whose normalized phoneNumber is in the list
    const registeredUsers = await User.find({
      phoneNumber: { $in: normalizedPhones },
      isRegistered: true,
    }).select("phoneNumber fullname avatarURL status isOnline -_id"); // only return needed fields

    return res.json(registeredUsers);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load registered contacts" });
  }
}