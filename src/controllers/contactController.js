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

function compressPhone(phone) {
  if (!phone) return '';
  return phone.replace(/\D/g, ''); // Strips everything except digits
}

export const registeredUsers = async (req, res) => {
  try {
    const { phoneNumbers } = req.body;
    if (!Array.isArray(phoneNumbers)) return res.status(400).send("Invalid input");

    const compressedPhones = phoneNumbers.map(p => compressPhone(p));

    // Get all registered users
    const users = await User.find({ isRegistered: true })
      .select("phoneNumber fullname avatarURL status isOnline -_id");

    // Match them
    const matchedUsers = users.filter(user => {
      const cleanDbPhone = compressPhone(user.phoneNumber);
      // We check if the DB phone (cleaned) exists in the requested list (cleaned)
      return compressedPhones.includes(cleanDbPhone);
    });

    return res.json(matchedUsers);
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
};