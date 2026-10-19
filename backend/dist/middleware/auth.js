"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            message: 'Authentication required. Please enter the studio admin password.',
        });
        return;
    }
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'inderpushp_studio_admin_jwt_secret_2026';
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (decoded.role !== 'admin' && decoded.role !== 'artist') {
            res.status(403).json({
                success: false,
                message: 'Forbidden. Admin privileges required.',
            });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired session token. Please log in again.',
        });
        return;
    }
};
exports.authenticateAdmin = authenticateAdmin;
