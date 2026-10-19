import { Router, Request, Response } from 'express';
import { ContactEnquiry } from '../models/ContactEnquiry';
import { authenticateAdmin } from '../middleware/auth';
import { sendEnquiryNotification } from '../services/email.service';

const router = Router();

// In-memory rate limiting map (IP -> timestamps[]) to prevent spam
const rateLimitWindowMs = 15 * 60 * 1000; // 15 minutes
const maxRequestsPerWindow = 6;
const ipRequestHistory = new Map<string, number[]>();

const isSpamRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const history = ipRequestHistory.get(ip) || [];
  // Keep only timestamps within window
  const validTimestamps = history.filter((timestamp) => now - timestamp < rateLimitWindowMs);
  if (validTimestamps.length >= maxRequestsPerWindow) {
    ipRequestHistory.set(ip, validTimestamps);
    return true;
  }
  validTimestamps.push(now);
  ipRequestHistory.set(ip, validTimestamps);
  return false;
};

// POST /api/contact - Submit a new enquiry (public with rate limit and spam detection)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    // 1. Rate limiting spam check
    if (isSpamRateLimited(clientIp)) {
      res.status(429).json({
        success: false,
        message: 'Too many enquiries submitted from your network. Please wait a few moments before trying again.',
      });
      return;
    }

    const { fullName, email, phone, subject, message, botTrap } = req.body;

    // 2. Honeypot bot protection
    if (botTrap) {
      // Silently accept bots without persisting
      res.status(200).json({
        success: true,
        message: 'Your message has been received.',
      });
      return;
    }

    // 3. Validation
    if (!fullName || !fullName.trim()) {
      res.status(400).json({ success: false, message: 'Full name is required.' });
      return;
    }

    if (!email || !email.trim()) {
      res.status(400).json({ success: false, message: 'Email address is required.' });
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    if (!phone || !phone.trim()) {
      res.status(400).json({ success: false, message: 'Phone number is required.' });
      return;
    }

    const phoneDigits = phone.replace(/[\s\-\(\)\+]/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15 || !/^\+?[0-9\s\-\(\)]+$/.test(phone.trim())) {
      res.status(400).json({ success: false, message: 'Please provide a valid phone number (7-15 digits).' });
      return;
    }

    if (!message || !message.trim()) {
      res.status(400).json({ success: false, message: 'Message content is required.' });
      return;
    }

    if (message.trim().length < 5) {
      res.status(400).json({ success: false, message: 'Please provide a little more detail in your message.' });
      return;
    }

    const validSubjects = [
      'Enquiry About an Artwork',
      'Personalised Commission',
      'Bulk or Corporate Enquiry',
      'General Question',
      'Other',
    ];

    const sanitizedSubject = validSubjects.includes(subject) ? subject : 'General Question';

    // 4. Save to Database
    const newEnquiry = await ContactEnquiry.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: sanitizedSubject,
      message: message.trim(),
      status: 'new',
    });

    // 5. Send Email Notification via Resend asynchronously (does not block client response)
    sendEnquiryNotification({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: sanitizedSubject,
      message: message.trim(),
      enquiryId: String(newEnquiry._id),
    }).catch((err) => {
      console.error('[Contact] Failed to send email notification:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been received. Geetu will get back to you shortly.',
      enquiryId: newEnquiry._id,
    });
  } catch (error: any) {
    console.error('Error saving contact enquiry:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to submit enquiry. Please try again.',
    });
  }
});

// GET /api/contact - Admin list enquiries
router.get('/', authenticateAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const enquiries = await ContactEnquiry.find().sort({ createdAt: -1 }).limit(100);
    res.json({
      success: true,
      enquiries,
    });
  } catch (error: any) {
    console.error('Error listing contact enquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve enquiries.',
    });
  }
});

export default router;
