"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// Keep files in memory as buffer so we can stream directly to Cloudinary or validate
const storage = multer_1.default.memoryStorage();
// File type validation: only jpeg, png, webp, avif
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file format. Only JPG, PNG, WEBP, and AVIF images are allowed.'));
    }
};
// Size limit: 10MB max per image
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 6, // max 6 files per upload batch
    },
    fileFilter,
});
