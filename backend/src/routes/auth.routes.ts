import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { authenticateAdmin, AuthRequest } from '../middleware/auth';

dotenv.config();

const router = Router();

// Login Rate Limiting (in-memory per client IP): 5 failed attempts per 15-minute window
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_LOGIN_ATTEMPTS = 5;
interface LoginAttemptRecord {
  failedCount: number;
  firstFailedAt: number;
  blockedUntil?: number;
}
const loginAttemptHistory = new Map<string, LoginAttemptRecord>();

const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
};

export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL CONFIGURATION ERROR: JWT_SECRET environment variable is missing.');
    }
    return 'inderpushp_studio_admin_jwt_secret_dev_only';
  }
  return secret;
};

/**
 * Seed or update initial admin user with configured password hash
 */
const ensureInitialAdmin = async () => {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    let adminHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminHash) {
      if (!adminPassword) {
        if (process.env.NODE_ENV === 'production') {
          console.error('CRITICAL CONFIGURATION ERROR: Neither ADMIN_PASSWORD nor ADMIN_PASSWORD_HASH is set.');
          return;
        }
        console.warn('[Auth] ADMIN_PASSWORD not configured. Please set ADMIN_PASSWORD in environment.');
        return;
      }
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
      // Ensure existing admin record is synchronized with configured hash and current name
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
 * Password-only authentication for Studio Admin with rate limiting & secure bcrypt comparison
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const clientIp = getClientIp(req);
  const now = Date.now();

  // Check rate limiting status for this IP
  const record = loginAttemptHistory.get(clientIp);
  if (record && record.blockedUntil && record.blockedUntil > now) {
    const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    res.status(429).json({
      success: false,
      message: `Too many unsuccessful login attempts. Please wait ${remainingSeconds} seconds before trying again.`,
    });
    return;
  }

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
    let targetHash = adminUser?.passwordHash || process.env.ADMIN_PASSWORD_HASH;

    // If no hash stored but ADMIN_PASSWORD is set in env, generate and store the hash
    if (!targetHash && process.env.ADMIN_PASSWORD) {
      const salt = await bcrypt.genSalt(10);
      targetHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      if (adminUser) {
        adminUser.passwordHash = targetHash;
        await adminUser.save();
      }
    }

    if (!targetHash) {
      res.status(500).json({
        success: false,
        message: 'Admin account configuration is incomplete. Please verify server environment.',
      });
      return;
    }

    // Secure bcrypt comparison
    const isMatch = await bcrypt.compare(trimmedPassword, targetHash);

    if (!isMatch) {
      // Record failed attempt
      const current = loginAttemptHistory.get(clientIp) || { failedCount: 0, firstFailedAt: now };
      if (now - current.firstFailedAt > LOGIN_WINDOW_MS) {
        current.failedCount = 1;
        current.firstFailedAt = now;
      } else {
        current.failedCount += 1;
      }

      if (current.failedCount >= MAX_FAILED_LOGIN_ATTEMPTS) {
        current.blockedUntil = now + LOGIN_WINDOW_MS;
      }
      loginAttemptHistory.set(clientIp, current);

      res.status(401).json({
        success: false,
        message: 'Incorrect password. Access denied.',
      });
      return;
    }

    // On successful login, reset failed attempts for this client
    loginAttemptHistory.delete(clientIp);

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
      message: 'Internal server error during login.',
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
