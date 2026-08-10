import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary client — بيتهيأ مرة واحدة ويتستخدم في كل الـ API routes
 * الـ credentials بتييجي من .env
 */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
