import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Initialize Firebase Admin
// Replace with your Firebase service account JSON
import serviceAccount from "../config/firebaseServiceAccount.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // e.g., "myapp.appspot.com"
  });
}

const bucket = admin.storage().bucket();

/**
 * Uploads a file buffer to Firebase Storage
 * @param {Buffer} fileBuffer - file data
 * @param {String} originalName - original file name (used for extension)
 * @param {String} folder - folder in bucket (e.g., "profile", "messages")
 * @returns {Promise<String>} - public download URL
 */
export async function uploadFile(fileBuffer, originalName, folder = "misc") {
  try {
    const ext = path.extname(originalName);
    const filename = `${folder}/${uuidv4()}${ext}`;
    const file = bucket.file(filename);

    const stream = file.createWriteStream({
      metadata: {
        contentType: getContentType(ext),
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(), // Required for public URL
        },
      },
    });

    return new Promise((resolve, reject) => {
      stream.on("error", (err) => reject(err));
      stream.on("finish", async () => {
        // Construct public URL
        const downloadURL = `https://firebasestorage.googleapis.com/v0/b/chatterbox-5c34a.firebasestorage.app/o/${encodeURIComponent(filename)}?alt=media&token=${file.metadata.metadata.firebaseStorageDownloadTokens}`;
        resolve(downloadURL);
      });
      stream.end(fileBuffer);
    });
  } catch (err) {
    throw new Error(`Firebase upload failed: ${err.message}`);
  }
}

/**
 * Helper: map file extension to content type
 */
function getContentType(ext) {
  switch (ext.toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".mp4":
      return "video/mp4";
    case ".mp3":
      return "audio/mpeg";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}
