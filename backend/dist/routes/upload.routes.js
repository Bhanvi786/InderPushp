"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = require("../middleware/upload");
const auth_1 = require("../middleware/auth");
const imagekit_service_1 = require("../services/imagekit.service");
const imagekit_1 = require("../config/imagekit");
const cloudinary_service_1 = require("../services/cloudinary.service");
const cloudinary_1 = require("../config/cloudinary");
const router = (0, express_1.Router)();
/**
 * GET /api/upload/status
 * Check if ImageKit (or Cloudinary) is configured (Admin Only)
 */
router.get('/status', auth_1.authenticateAdmin, (req, res) => {
    const imageKitStatus = (0, imagekit_1.configureImageKit)();
    const cloudinaryStatus = (0, cloudinary_1.configureCloudinary)();
    const isConfigured = imageKitStatus.isConfigured || cloudinaryStatus.isConfigured;
    const activeProvider = imageKitStatus.isConfigured
        ? 'imagekit'
        : cloudinaryStatus.isConfigured
            ? 'cloudinary'
            : 'none';
    let message = '';
    if (imageKitStatus.isConfigured) {
        message = 'ImageKit is configured and active for high-speed media delivery.';
    }
    else if (cloudinaryStatus.isConfigured) {
        message = 'Cloudinary is configured and active.';
    }
    else {
        message =
            'ImageKit credentials (IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT) are pending. Local browser previews and manual URLs are active.';
    }
    res.json({
        success: true,
        configured: isConfigured,
        provider: activeProvider,
        message,
    });
});
/**
 * POST /api/upload/single
 * Upload a single image file (ImageKit priority)
 */
router.post('/single', auth_1.authenticateAdmin, upload_1.upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'No image file provided. Please choose a valid image to upload.',
            });
            return;
        }
        const folder = req.body.folder || '/inderpushp_artworks';
        const imageKitStatus = (0, imagekit_1.configureImageKit)();
        if (imageKitStatus.isConfigured) {
            const uploadResult = await (0, imagekit_service_1.uploadBufferToImageKit)(req.file.buffer, req.file.originalname, folder);
            res.status(200).json({
                success: true,
                provider: 'imagekit',
                message: 'Image uploaded successfully to ImageKit.',
                data: uploadResult,
            });
            return;
        }
        const cloudinaryStatus = (0, cloudinary_1.configureCloudinary)();
        if (cloudinaryStatus.isConfigured) {
            const uploadResult = await (0, cloudinary_service_1.uploadBufferToCloudinary)(req.file.buffer, folder.replace(/^\//, ''));
            res.status(200).json({
                success: true,
                provider: 'cloudinary',
                message: 'Image uploaded successfully to Cloudinary.',
                data: uploadResult,
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: 'No media storage provider configured. Please provide ImageKit credentials in backend/.env.',
        });
    }
    catch (error) {
        console.error('Upload single error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Image upload failed. Please verify ImageKit credentials and network connection.',
        });
    }
});
/**
 * POST /api/upload/multiple
 * Upload up to 6 images simultaneously
 */
router.post('/multiple', auth_1.authenticateAdmin, upload_1.upload.array('images', 6), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({
                success: false,
                message: 'No image files provided.',
            });
            return;
        }
        const folder = req.body.folder || '/inderpushp_artworks';
        const imageKitStatus = (0, imagekit_1.configureImageKit)();
        if (imageKitStatus.isConfigured) {
            const uploadPromises = files.map((file) => (0, imagekit_service_1.uploadBufferToImageKit)(file.buffer, file.originalname, folder));
            const results = await Promise.all(uploadPromises);
            res.status(200).json({
                success: true,
                provider: 'imagekit',
                message: `${results.length} image(s) uploaded successfully to ImageKit.`,
                data: results,
            });
            return;
        }
        const cloudinaryStatus = (0, cloudinary_1.configureCloudinary)();
        if (cloudinaryStatus.isConfigured) {
            const uploadPromises = files.map((file) => (0, cloudinary_service_1.uploadBufferToCloudinary)(file.buffer, folder.replace(/^\//, '')));
            const results = await Promise.all(uploadPromises);
            res.status(200).json({
                success: true,
                provider: 'cloudinary',
                message: `${results.length} image(s) uploaded successfully to Cloudinary.`,
                data: results,
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: 'No media storage provider configured. Please provide ImageKit credentials in backend/.env.',
        });
    }
    catch (error) {
        console.error('Multiple upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload images.',
        });
    }
});
/**
 * POST /api/upload/delete
 * Safely delete asset from ImageKit or Cloudinary
 */
router.post('/delete', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const { publicId } = req.body;
        if (!publicId) {
            res.status(400).json({ success: false, message: 'File / Public ID is required.' });
            return;
        }
        const ikDeleted = await (0, imagekit_service_1.deleteFromImageKit)(publicId);
        if (ikDeleted) {
            res.json({
                success: true,
                deleted: true,
                provider: 'imagekit',
                message: 'Asset deleted from ImageKit.',
            });
            return;
        }
        const cldDeleted = await (0, cloudinary_service_1.deleteFromCloudinary)(publicId);
        res.json({
            success: true,
            deleted: cldDeleted,
            provider: 'cloudinary',
            message: cldDeleted ? 'Asset deleted from Cloudinary.' : 'Asset not found or already removed.',
        });
    }
    catch (error) {
        console.error('Delete upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete asset.',
        });
    }
});
exports.default = router;
