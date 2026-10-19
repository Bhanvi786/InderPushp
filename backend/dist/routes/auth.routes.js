"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtSecret = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
dotenv_1.default.config();
const router = (0, express_1.Router)();
const getJwtSecret = () => process.env.JWT_SECRET || 'inderpushp_studio_admin_jwt_secret_2026';
exports.getJwtSecret = getJwtSecret;
/**
 * Seed or update initial admin user with configured password hash
 */
const ensureInitialAdmin = async () => {
    try {
        const adminPassword = process.env.ADMIN_PASSWORD || 'Geetu54321';
        let adminHash = process.env.ADMIN_PASSWORD_HASH;
        if (!adminHash) {
            const salt = await bcryptjs_1.default.genSalt(10);
            adminHash = await bcryptjs_1.default.hash(adminPassword, salt);
        }
        const existingAdmin = await User_1.User.findOne({ role: 'admin' });
        if (!existingAdmin) {
            await User_1.User.create({
                email: 'admin@inderpushp.local',
                passwordHash: adminHash,
                name: 'InderPushp Studio Admin',
                role: 'admin',
            });
            console.log('Studio Administrator initialized with secure password hash.');
        }
        else {
            // Ensure existing admin record is updated with current configured password hash
            existingAdmin.passwordHash = adminHash;
            await existingAdmin.save();
            console.log('Studio Administrator password hash synchronized.');
        }
    }
    catch (err) {
        console.error('Error synchronizing studio administrator account:', err);
    }
};
ensureInitialAdmin();
/**
 * POST /api/auth/login
 * Password-only authentication for Studio Admin
 */
router.post('/login', async (req, res) => {
    try {
        const { password } = req.body;
        if (!password || typeof password !== 'string' || !password.trim()) {
            res.status(400).json({
                success: false,
                message: 'Please enter the studio admin password.',
            });
            return;
        }
        const trimmedPassword = password.trim();
        // Retrieve target password hash from database or environment
        const adminUser = await User_1.User.findOne({ role: 'admin' });
        const targetHash = adminUser?.passwordHash || process.env.ADMIN_PASSWORD_HASH;
        const targetEnvPassword = process.env.ADMIN_PASSWORD || 'Geetu54321';
        let isMatch = false;
        if (targetHash) {
            isMatch = await bcryptjs_1.default.compare(trimmedPassword, targetHash);
        }
        // Direct comparison fallback if hash comparison fails or hash is not yet generated
        if (!isMatch && targetEnvPassword && trimmedPassword === targetEnvPassword) {
            isMatch = true;
            // Re-hash and save to DB
            if (adminUser) {
                const salt = await bcryptjs_1.default.genSalt(10);
                adminUser.passwordHash = await bcryptjs_1.default.hash(trimmedPassword, salt);
                await adminUser.save();
            }
        }
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Incorrect password. Access denied.',
            });
            return;
        }
        const adminId = adminUser?._id ? String(adminUser._id) : 'studio-admin';
        const adminName = adminUser?.name || 'InderPushp Studio Admin';
        const token = jsonwebtoken_1.default.sign({
            id: adminId,
            role: 'admin',
            name: adminName,
        }, (0, exports.getJwtSecret)(), { expiresIn: '7d' });
        res.json({
            success: true,
            message: 'Authentication successful.',
            token,
            user: {
                id: adminId,
                name: adminName,
                role: 'admin',
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error during login.',
        });
    }
});
/**
 * GET /api/auth/me
 * Validate current session and get user profile
 */
router.get('/me', auth_1.authenticateAdmin, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized session.' });
            return;
        }
        let user = null;
        if (req.user.id && req.user.id !== 'studio-admin') {
            try {
                user = await User_1.User.findById(req.user.id).select('-passwordHash');
            }
            catch {
                // Fall back to decoded token user
            }
        }
        res.json({
            success: true,
            user: {
                id: user?._id ? String(user._id) : req.user.id || 'studio-admin',
                name: user?.name || req.user.name || 'InderPushp Studio Admin',
                role: req.user.role || 'admin',
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching user session.',
        });
    }
});
/**
 * POST /api/auth/logout
 * End the current session
 */
router.post('/logout', (_req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully.',
    });
});
exports.default = router;
