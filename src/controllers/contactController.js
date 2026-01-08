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

// contactController.js
import User from "../models/userModel.js";

/*** Compress phone number: removes all non-digit characters except leading + */
function compressPhone(phone) {
  if (!phone) return '';
  
  // If it starts with +, keep it. Otherwise just digits.
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

    // 1. Clean the incoming list from the phone
    const compressedFrontEndPhones = phoneNumbers.map(p => compressPhone(p));

    // 2. Fetch ALL registered users (This is the "Old" logic that works)
    const users = await User.find({
      isRegistered: true,
    }).select("phoneNumber fullname avatarURL status isOnline -_id");

    // 3. Filter manually in JavaScript
    // We compress the DB phone number right here effectively standardizing it before comparison
    const matchedUsers = users.filter(user => {
      const dbPhoneClean = compressPhone(user.phoneNumber);
      return compressedFrontEndPhones.includes(dbPhoneClean);
    });

    console.log(`Matched users found: ${matchedUsers.length}`);

    return res.json(matchedUsers);

  } catch (error) {
    console.error("Error fetching registered users:", error);
    return res.status(500).json({ message: "Failed to load registered contacts" });
  }
};