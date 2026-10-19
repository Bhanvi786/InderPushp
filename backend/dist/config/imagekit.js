"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureImageKit = void 0;
const imagekit_1 = __importDefault(require("imagekit"));
const configureImageKit = () => {
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
    const isConfigured = Boolean(publicKey &&
        privateKey &&
        urlEndpoint &&
        publicKey !== 'your_imagekit_public_key' &&
        privateKey !== 'your_imagekit_private_key' &&
        !urlEndpoint.includes('your_imagekit_id'));
    let imagekit = null;
    if (isConfigured) {
        imagekit = new imagekit_1.default({
            publicKey: publicKey,
            privateKey: privateKey,
            urlEndpoint: urlEndpoint,
        });
    }
    return { isConfigured, imagekit };
};
exports.configureImageKit = configureImageKit;
exports.default = exports.configureImageKit;
