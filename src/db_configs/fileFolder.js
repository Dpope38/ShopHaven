/* eslint-disable no-undef */
import cloudinaryPackage from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import AppError from "../utils/appError.js";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

const cloudinary = cloudinaryPackage.v2;

// Configure Cloudinary
// try {
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET,
//   });
// } catch (err) {
//   console.log(err);
// }

// console.log(cloudinary.config());
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_SECRET
) {
  throw new AppError(
    "Missing Cloudinary credentials in environment variables",
    500,
  );
}
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
} catch (err) {
  // Convert the Cloudinary error into your AppError format
  throw new AppError(
    "Cloudinary configuration failed: " +
      (err.message || "Missing credentials"),
    500,
  );
}
// Create storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Ecommerce-api", // Folder in Cloudinary to store images
    allowed_formats: ["jpg", "jpeg", "png"], // Restrict file formats
  },
});

//Initiate Multer with storage engine
const upload = multer({
  storage,
});

export default upload;
