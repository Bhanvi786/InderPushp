import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { authenticateAdmin, AuthRequest } from '../middleware/auth';

dotenv.config();

const router = Router();

export const getJwtSecret = (): string =>
  process.env.JWT_SECRET || 'inderpushp_studio_admin_jwt_secret_2026';

/**
 * Seed or update initial admin user with configured password hash
 */
const ensureInitialAdmin = async () => {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD || 'Geetu54321';
    let adminHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminHash) {
      const salt = await bcrypt.genSalt(10);
      adminHash = await bcrypt.hash(adminPassword, salt);
    }

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      await User.create({
        email: 'admin@inderpushp.local',
        passwordHash: adminHash,
        name: 'Geetu Jaidka',
        role: 'admin',
      });
      console.log('Studio Administrator initialized with secure password hash.');
    } else {
      // Ensure existing admin record is updated with current configured password hash and name
      existingAdmin.passwordHash = adminHash;
      if (existingAdmin.name === 'Deepti' || !existingAdmin.name) {
        existingAdmin.name = 'Geetu Jaidka';
      }
      await existingAdmin.save();
      console.log('Studio Administrator password hash synchronized.');
    }
  } catch (err) {
    console.error('Error synchronizing studio administrator account:', err);
  }
};

ensureInitialAdmin();

/**
 * POST /api/auth/login
 * Password-only authentication for Studio Admin
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
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
    const adminUser = await User.findOne({ role: 'admin' });
    const targetHash = adminUser?.passwordHash || process.env.ADMIN_PASSWORD_HASH;
    const targetEnvPassword = process.env.ADMIN_PASSWORD || 'Geetu54321';

    let isMatch = false;

    if (targetHash) {
      isMatch = await bcrypt.compare(trimmedPassword, targetHash);
    }

    // Direct comparison fallback if hash comparison fails or hash is not yet generated
    if (!isMatch && targetEnvPassword && trimmedPassword === targetEnvPassword) {
      isMatch = true;
      // Re-hash and save to DB
      if (adminUser) {
        const salt = await bcrypt.genSalt(10);
        adminUser.passwordHash = await bcrypt.hash(trimmedPassword, salt);
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

    const token = jwt.sign(
      {
        id: adminId,
        role: 'admin',
        name: adminName,
      },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

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
  } catch (error: any) {
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
router.get('/me', authenticateAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized session.' });
      return;
    }

    let user = null;
    if (req.user.id && req.user.id !== 'studio-admin') {
      try {
        user = await User.findById(req.user.id).select('-passwordHash');
      } catch {
        // Fall back to decoded token user
      }
    }

    res.json({
      success: true,
      user: {
        id: user?._id ? String(user._id) : req.user.id || 'studio-admin',
        name: user?.name || req.user.name || 'Geetu Jaidka',
        role: req.user.role || 'admin',
      },
    });
  } catch (error: any) {
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
router.post('/logout', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});

export default router;
