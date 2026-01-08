// import User from "../models/userModel.js";

// /*** Compress phone number to simple format: +CCXXXXXXXXXX * - Keeps leading '+' * - Removes all other non-digit characters * - Works for any country code */
// function compressPhone(phone) {
//   if (!phone) return '';

//   // Keep leading '+' if it exists, remove everything else that's not a digit
//   if (phone.startsWith('+')) {
//     return '+' + phone.slice(1).replace(/\D/g, '');
//   }

//   // If no '+', just remove non-digit characters
//   return phone.replace(/\D/g, '');
// }

// /*** Controller: Returns registered users whose phone numbers match frontend numbers */
// export const registeredUsers = async (req, res) => {
//   try {
//     const { phoneNumbers } = req.body;

//     if (!Array.isArray(phoneNumbers)) {
//       return res.status(400).json({ message: "phoneNumbers must be an array" });
//     }

//     // Compress all frontend numbers to compare
//     const compressedPhones = phoneNumbers.map(phone => compressPhone(phone));

//     // Fetch registered users from DB
//     const users = await User.find({
//       isRegistered: true,
//     }).select("phoneNumber fullname avatarURL status isOnline -_id");

//     // Compress DB phone numbers for comparison
//     const matchedUsers = users.filter(user => compressedPhones.includes(compressPhone(user.phoneNumber)));

//     console.log(`Matched users found: ${matchedUsers.length}`);

//     return res.json(matchedUsers);

//   } catch (error) {
//     console.error("Error fetching registered users:", error);
//     return res.status(500).json({ message: "Failed to load registered contacts" });
//   }
// };

import User from "../models/userModel.js";

/*** * Helper: Compress phone number 
 * Ideally, your DB and Frontend should both use E.164 standard (e.g., +1234567890)
 */
function compressPhone(phone) {
  if (!phone) return '';
  // Keep leading '+' if exists, remove everything else that's not a digit
  if (phone.startsWith('+')) {
    return '+' + phone.slice(1).replace(/\D/g, '');
  }
  return phone.replace(/\D/g, '');
}

/*** Controller: Returns registered users whose phone numbers match frontend numbers */
export const registeredUsers = async (req, res) => {
  try {
    const { phoneNumbers } = req.body;

    if (!Array.isArray(phoneNumbers)) {
      return res.status(400).json({ message: "phoneNumbers must be an array" });
    }

    // 1. Clean the incoming list of numbers
    const compressedPhones = phoneNumbers
        .map(phone => compressPhone(phone))
        .filter(p => p.length > 0); // remove empty strings

    // 2. Query the Database directly for these numbers
    // The '$in' operator finds any document where 'phoneNumber' exists in our list
    const matchedUsers = await User.find({
      isRegistered: true,
      phoneNumber: { $in: compressedPhones } 
    }).select("phoneNumber fullname avatarURL status isOnline -_id");

    console.log(`Matched users found: ${matchedUsers.length}`);

    return res.json(matchedUsers);

  } catch (error) {
    console.error("Error fetching registered users:", error);
    return res.status(500).json({ message: "Failed to load registered contacts" });
  }
};