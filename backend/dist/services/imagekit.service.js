"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromImageKit = exports.uploadBufferToImageKit = void 0;
const imagekit_1 = require("../config/imagekit");
/**
 * Uploads an in-memory buffer to ImageKit into the designated folder.
 */
const uploadBufferToImageKit = async (buffer, fileName = 'artwork.jpg', folder = '/inderpushp_artworks') => {
    const { isConfigured, imagekit } = (0, imagekit_1.configureImageKit)();
    if (!isConfigured || !imagekit) {
        throw new Error('ImageKit is not configured. Please supply IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in backend/.env');
    }
    const cleanFolder = folder.startsWith('/') ? folder : `/${folder}`;
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_') || `artwork_${Date.now()}.jpg`;
    try {
        const response = await imagekit.upload({
            file: buffer.toString('base64'),
            fileName: sanitizedFileName,
            folder: cleanFolder,
            useUniqueFileName: true,
        });
        return {
            url: response.url,
            publicId: response.fileId,
            format: response.fileType,
            width: response.width,
            height: response.height,
            thumbnailUrl: response.thumbnailUrl,
        };
    }
    catch (error) {
        console.error('ImageKit upload error details:', error);
        throw new Error(error.message || 'Upload to ImageKit failed');
    }
};
exports.uploadBufferToImageKit = uploadBufferToImageKit;
/**
 * Deletes an image from ImageKit using its fileId (stored as publicId).
 */
const deleteFromImageKit = async (fileId) => {
    if (!fileId)
        return false;
    const { isConfigured, imagekit } = (0, imagekit_1.configureImageKit)();
    if (!isConfigured || !imagekit) {
        console.warn('ImageKit cleanup skipped: credentials not configured');
        return false;
    }
    try {
        await imagekit.deleteFile(fileId);
        return true;
    }
    catch (error) {
        console.error(`Failed to delete ImageKit asset ${fileId}:`, error);
        return false;
    }
};
exports.deleteFromImageKit = deleteFromImageKit;
