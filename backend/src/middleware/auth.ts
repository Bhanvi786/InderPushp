import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    name?: string;
    email?: string;
  };
}

export const authenticateAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please enter the studio admin password.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({
        success: false,
        message: 'Server configuration error: authentication secret is missing.',
      });
      return;
    }
  }

  const effectiveSecret = secret || 'inderpushp_studio_admin_jwt_secret_dev_only';

  try {
    const decoded = jwt.verify(token, effectiveSecret) as {
      id: string;
      role: string;
      name?: string;
      email?: string;
    };

    if (decoded.role !== 'admin' && decoded.role !== 'artist') {
      res.status(403).json({
        success: false,
        message: 'Forbidden. Admin privileges required.',
      });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.',
    });
    return;
  }
};
