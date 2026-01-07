// import { log } from "console";
// import User from "../models/userModel.js";

// export const registeredUsers = async (req, res) => {
//   try {
//     const { phoneNumbers } = req.body;

//     if (!Array.isArray(phoneNumbers)) {
//       return res.status(400).json({ message: "phoneNumbers must be an array" });
//     }

//     console.log(`phoneNumbers:${phoneNumbers}`);

//     // Normalize phone numbers: remove spaces and optional '+' at start
//     const normalizedPhones = phoneNumbers.map(num =>
//       num.replace(/\s+/g, "").replace(/^\+/, "")
//     );

//     console.log(`normalizedPhones:${normalizedPhones}`)

//     // Fetch only users who are registered and whose normalized phoneNumber is in the list
//     const registeredUsers = await User.find({
//       phoneNumber: { $in: normalizedPhones },
//       isRegistered: true,
//     }).select("phoneNumber fullname avatarURL status isOnline -_id"); // only return needed fields

//     return res.json(registeredUsers);

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Failed to load registered contacts" });
//   }
// }

import User from "../models/userModel.js";
function formatPhoneToDBStyle(phone) {
  if (!phone) return '';

  // Remove all non-digit characters except '+'
  phone = phone.replace(/[^\d+]/g, '');

  // If it starts with '+', extract country code dynamically
  if (phone.startsWith('+')) {
    // Match '+' followed by 1-3 digits for country code
    const match = phone.match(/^\+\d{1,3}/);
    if (match) {
      const cc = match[0];                  // country code part
      const rest = phone.slice(cc.length);  // rest of the number (local number)
      return `${cc} ${rest}`;
    }
  }

  // If no '+', just return digits as-is
  return phone;
}

export const registeredUsers = async (req, res) => {
  try {
    const { phoneNumbers } = req.body;

    if (!Array.isArray(phoneNumbers)) {
      return res.status(400).json({ message: "phoneNumbers must be an array" });
    }

    console.log(`Original phoneNumbers from frontend: ${phoneNumbers}`);

    // Convert all frontend numbers to DB format
    const formattedPhones = phoneNumbers.map(phone => formatPhoneToDBStyle(phone));

    console.log(`Formatted phones for DB comparison: ${formattedPhones}`);

    // Fetch registered users from DB whose phoneNumber exactly matches formattedPhones
    const registeredUsers = await User.find({
      phoneNumber: { $in: formattedPhones },
      isRegistered: true,
    }).select("phoneNumber fullname avatarURL status isOnline -_id");

    console.log(`Registered users found: ${registeredUsers.length}`);

    return res.json(registeredUsers);

  } catch (error) {
    console.error("Error fetching registered users:", error);
    return res.status(500).json({ message: "Failed to load registered contacts" });
  }
};
