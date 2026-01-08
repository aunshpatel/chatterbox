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

/*** Compress phone number to simple format: +CCXXXXXXXXXX */
function compressPhone(phone) {
  if (!phone) return '';

  if (phone.startsWith('+')) {
    return '+' + phone.slice(1).replace(/\D/g, '');
  }

  return phone.replace(/\D/g, '');
}

/*** Controller: Returns registered users whose phone numbers or contact names match contacts list or search query */
export const registeredUsers = async (req, res) => {
  try {
    const { contacts, searchQuery } = req.body;

    if (!Array.isArray(contacts)) {
      return res.status(400).json({ message: "Contacts must be an array!" });
    }

    const orConditions = [];

    // 1️⃣ Partial phone match for contacts list
    const compressedPhones = contacts.map(c => compressPhone(c.phone)).filter(Boolean);

    compressedPhones.forEach(phone => {
      const escapedPhone = phone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      orConditions.push({ phoneNumber: { $regex: escapedPhone } });
    });

    // 2️⃣ Flexible search bar handling
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.trim();

      // If query contains at least one digit, treat it as a phone number too
      const hasDigit = /\d/.test(query);
      if (hasDigit) {
        const compressedQuery = compressPhone(query);
        if (compressedQuery) {
          const escapedQuery = compressedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          orConditions.push({ phoneNumber: { $regex: escapedQuery } });
        }
      }

      // Always treat it as a name too (case-insensitive)
      orConditions.push({ fullname: { $regex: query, $options: "i" } });
    }

    // If no search criteria, return empty array
    if (orConditions.length === 0) return res.json([]);

    // Fetch matched users
    const matchedUsers = await User.find({
      isRegistered: true,
      $or: orConditions
    }).select("phoneNumber fullname avatarURL status isOnline -_id");

    console.log(`Matched users found: ${matchedUsers.length}`);
    return res.json(matchedUsers);

  } catch (error) {
    console.error("Error fetching registered users:", error);
    return res.status(500).json({ message: "Failed to load registered contacts" });
  }
};