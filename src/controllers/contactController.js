// import User from "../models/userModel.js";

// function compressPhone(phone) {
//   if (!phone) return '';
//   return phone.replace(/\D/g, ''); // Strips everything except digits
// }

// export const registeredUsers = async (req, res) => {
//   try {
//     const { phoneNumbers } = req.body;
//     if (!Array.isArray(phoneNumbers)) return res.status(400).send("Invalid input");

//     const compressedPhones = phoneNumbers.map(p => compressPhone(p));

//     // Get all registered users
//     const users = await User.find({ isRegistered: true }).select("phoneNumber fullname avatarURL status isOnline -_id");

//     // Match them
//     const matchedUsers = users.filter(user => {
//       const cleanDbPhone = compressPhone(user.phoneNumber);
//       // We check if the DB phone (cleaned) exists in the requested list (cleaned)
//       return compressedPhones.includes(cleanDbPhone);
//     });

//     return res.json(matchedUsers);
//   } catch (error) {
//     return res.status(500).json({ message: "Error" });
//   }
// };

import User from "../models/userModel.js";

/**
 * Normalize phone number by stripping all non-digit characters.
 * Example: "+1 (987) 654-3210" -> "19876543210"
 */
function compressPhone(phone) {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

/**
 * Endpoint to fetch registered users.
 * 
 * Body:
 * {
 *   phoneNumbers: ["+19876543210", "9876543211"],
 *   mode: "short" | "full"
 * }
 * 
 * - mode = "short": partial match for search bar
 * - mode = "full": exact match for device contacts
 */
export const registeredUsers = async (req, res) => {
  try {
    const { phoneNumbers, mode } = req.body;

    if (!Array.isArray(phoneNumbers)) {
      return res.status(400).json({ message: "Invalid input: phoneNumbers must be an array" });
    }

    const compressedPhones = phoneNumbers.map(p => compressPhone(p));

    // Fetch all registered users
    const users = await User.find({ isRegistered: true })
      .select("phoneNumber fullname avatarURL status isOnline -_id");

    let matchedUsers = [];

    if (mode === "short") {
      // Partial match: any input number substring matches user's phone
      matchedUsers = users.filter(user => {
        const cleanDbPhone = compressPhone(user.phoneNumber);
        return compressedPhones.some(input => cleanDbPhone.includes(input));
      });
    } else {
      // Full exact match
      matchedUsers = users.filter(user => {
        const cleanDbPhone = compressPhone(user.phoneNumber);
        return compressedPhones.includes(cleanDbPhone);
      });
    }

    return res.json(matchedUsers);

  } catch (error) {
    console.error("Error in registeredUsers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// import User from "../models/userModel.js";

// function compressPhone(phone) {
//   if (!phone) return '';
//   return phone.replace(/\D/g, ''); // Strips everything except digits
// }

// export const registeredUsers = async (req, res) => {
//   try {
//     const { phoneNumbers, mode } = req.body; 
//     // mode can be "short" for search bar, "full" for exact matches

//     if (!Array.isArray(phoneNumbers)) return res.status(400).send("Invalid input");

//     const compressedPhones = phoneNumbers.map(p => compressPhone(p));

//     // Get all registered users
//     const users = await User.find({ isRegistered: true }).select("phoneNumber fullname avatarURL status isOnline -_id");

//     let matchedUsers = [];

//     if (mode === "short") {
//       // Partial match
//       matchedUsers = users.filter(user => {
//         const cleanDbPhone = compressPhone(user.phoneNumber);
//         return compressedPhones.some(input => cleanDbPhone.includes(input));
//       });
//     } else {
//       // Full exact match
//       matchedUsers = users.filter(user => {
//         const cleanDbPhone = compressPhone(user.phoneNumber);
//         return compressedPhones.includes(cleanDbPhone);
//       });
//     }

//     return res.json(matchedUsers);

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Error" });
//   }
// };