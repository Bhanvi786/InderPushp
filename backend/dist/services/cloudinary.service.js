"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadBufferToCloudinary = void 0;
const cloudinary_1 = require("../config/cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
/**
 * Uploads an in-memory buffer to Cloudinary into the designated folder.
 * Gracefully handles cases where Cloudinary is not configured or fails.
 */
const uploadBufferToCloudinary = async (buffer, folder = 'inderpushp_gallery') => {
    const { isConfigured, cloudinary } = (0, cloudinary_1.configureCloudinary)();
    if (!isConfigured) {
        throw new Error('Cloudinary is not configured. Please supply CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env');
    }
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder,
            resource_type: 'image',
            transformation: [
                { quality: 'auto', fetch_format: 'auto' } // Auto optimize delivery for luxury art web resolution
            ],
        }, (error, result) => {
            if (error || !result) {
                return reject(error || new Error('Upload to Cloudinary failed'));
            }
            resolve({
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                width: result.width,
                height: result.height,
            });
        });
        streamifier_1.default.createReadStream(buffer).pipe(uploadStream);
    });
};
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
/**
 * Deletes an image from Cloudinary using its publicId.
 * Safe cleanup: fails silently or logs if public ID does not exist.
 */
const deleteFromCloudinary = async (publicId) => {
    if (!publicId)
        return false;
    const { isConfigured, cloudinary } = (0, cloudinary_1.configureCloudinary)();
    if (!isConfigured) {
        console.warn('Cloudinary cleanup skipped: credentials not configured');
        return false;
    }
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === 'ok';
    }
    catch (error) {
        console.error(`Failed to delete Cloudinary asset ${publicId}:`, error);
        return false;
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
