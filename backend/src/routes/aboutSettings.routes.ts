import { Router, Request, Response } from 'express';
import { AboutSettings } from '../models/AboutSettings';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

/**
 * GET /api/about-settings
 * Public endpoint to fetch the about video and settings
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await AboutSettings.findOne();
    if (!settings) {
      settings = await AboutSettings.create({
        videoUrl: '',
        posterUrl: '',
        heading: 'A Little More of My World',
        subheading: 'Step into my creative space and discover the little pieces, colours and stories that come together to make each artwork.',
      });
    }
    res.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    console.error('Error fetching about settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch about settings',
      error: error.message,
    });
  }
});

/**
 * PUT /api/about-settings
 * Admin endpoint to update the video URL, poster, and texts
 */
router.put('/', authenticateAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoUrl, posterUrl, heading, subheading } = req.body;

    let settings = await AboutSettings.findOne();
    if (!settings) {
      settings = new AboutSettings();
    }

    if (typeof videoUrl === 'string') settings.videoUrl = videoUrl.trim();
    if (typeof posterUrl === 'string') settings.posterUrl = posterUrl.trim();
    if (typeof heading === 'string' && heading.trim()) settings.heading = heading.trim();
    if (typeof subheading === 'string' && subheading.trim()) settings.subheading = subheading.trim();

    await settings.save();

    res.json({
      success: true,
      message: 'About settings updated successfully',
      data: settings,
    });
  } catch (error: any) {
    console.error('Error updating about settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update about settings',
      error: error.message,
    });
  }
});

export default router;
