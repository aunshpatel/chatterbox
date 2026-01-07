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

/**
 * Compress phone number to simple format: +CCXXXXXXXXXX
 * - Keeps leading '+'
 * - Removes all other non-digit characters
 * - Works for any country code
 */
function compressPhone(phone) {
  if (!phone) return '';

  // Keep leading '+' if it exists, remove everything else that's not a digit
  if (phone.startsWith('+')) {
    return '+' + phone.slice(1).replace(/\D/g, '');
  }

  // If no '+', just remove non-digit characters
  return phone.replace(/\D/g, '');
}

/**
 * Controller: Returns registered users whose phone numbers match frontend numbers
 */
export const registeredUsers = async (req, res) => {
  try {
    const { phoneNumbers } = req.body;

    if (!Array.isArray(phoneNumbers)) {
      return res.status(400).json({ message: "phoneNumbers must be an array" });
    }

    console.log(`Original phoneNumbers from frontend: ${phoneNumbers}`);

    // Compress all frontend numbers to compare
    const compressedPhones = phoneNumbers.map(phone => compressPhone(phone));

    console.log(`Compressed frontend phones: ${compressedPhones}`);

    // Fetch registered users from DB
    const users = await User.find({
      isRegistered: true,
    }).select("phoneNumber fullname avatarURL status isOnline -_id");

    // Compress DB phone numbers for comparison
    const matchedUsers = users.filter(user => compressedPhones.includes(compressPhone(user.phoneNumber)));

    console.log(`Matched users found: ${matchedUsers.length}`);

    return res.json(matchedUsers);

  } catch (error) {
    console.error("Error fetching registered users:", error);
    return res.status(500).json({ message: "Failed to load registered contacts" });
  }
};
