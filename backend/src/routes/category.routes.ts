import { Router, Request, Response } from 'express';
import { Category, ICategory } from '../models/Category';
import { Artwork } from '../models/Artwork';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// Slug generator helper
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

/**
 * The 6 core artwork categories for Inderpushp
 */
export const INITIAL_CATEGORIES = [
  {
    name: 'Floral & Nature',
    description: 'Includes flowers, plants, birds, animals and landscapes.',
  },
  {
    name: 'Figurative & Spiritual',
    description: 'Includes human portraits, Lord Krishna, other deities and spiritual artwork.',
  },
  {
    name: 'Abstract & Geometric',
    description: 'Includes abstract designs, geometric patterns and experimental mosaic art.',
  },
  {
    name: 'Decorative Art',
    description: 'Includes mirrors, decorative objects, framed pieces and functional art.',
  },
  {
    name: 'Art for Spaces',
    description: 'Includes wall installations, murals and custom artwork for homes, offices and other spaces.',
  },
  {
    name: 'Other',
    description: 'For artwork that does not fit any of the above categories.',
  },
];

const LEGACY_CATEGORY_MAP: Record<string, string> = {
  'floral': 'Floral & Nature',
  'nature & wildlife': 'Floral & Nature',
  'nature and wildlife': 'Floral & Nature',
  'figurative': 'Figurative & Spiritual',
  'spiritual': 'Figurative & Spiritual',
  'abstract': 'Abstract & Geometric',
  'geometric': 'Abstract & Geometric',
  'decorative objects': 'Decorative Art',
  'decorative art': 'Decorative Art',
  'art for spaces': 'Art for Spaces',
  'other': 'Other',
};

/**
 * Ensure the exact 6 core categories exist in MongoDB and reassign legacy categories
 */
export const ensureInitialCategories = async () => {
  try {
    // 1. Migrate any legacy artworks if they exist
    for (const [legacyKey, newCatName] of Object.entries(LEGACY_CATEGORY_MAP)) {
      if (legacyKey !== newCatName.toLowerCase()) {
        await Artwork.updateMany(
          { category: { $regex: new RegExp(`^${legacyKey.replace('&', '\\&')}$`, 'i') } },
          { category: newCatName }
        );
      }
    }

    // 2. Ensure each of the 6 final categories exists
    const validNames = INITIAL_CATEGORIES.map((item) => item.name);
    for (let i = 0; i < INITIAL_CATEGORIES.length; i++) {
      const item = INITIAL_CATEGORIES[i];
      const slug = slugify(item.name);
      const existing = await Category.findOne({
        $or: [
          { slug },
          { name: { $regex: new RegExp(`^${item.name.replace('&', '\\&')}$`, 'i') } },
        ],
      });

      if (!existing) {
        await Category.create({
          name: item.name.trim(),
          slug,
          description: item.description,
          displayOrder: i + 1,
          isActive: true,
        });
      } else {
        existing.name = item.name.trim();
        existing.slug = slug;
        existing.displayOrder = i + 1;
        existing.isActive = true;
        if (!existing.description) {
          existing.description = item.description;
        }
        await existing.save();
      }
    }

    // 3. Remove obsolete categories
    await Category.deleteMany({
      name: { $nin: validNames },
    });
  } catch (err) {
    console.error('Error ensuring 6 core categories:', err);
  }
};

// Seed/enforce categories on startup
ensureInitialCategories();

/**
 * GET /api/categories
 * Public endpoint: returns all active categories with published artwork count
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });

    // Aggregate artwork counts for each category
    const categoryCounts = await Artwork.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap: Record<string, number> = {};
    categoryCounts.forEach((c) => {
      if (c._id) countMap[c._id.toLowerCase()] = c.count;
    });

    const enriched = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      displayOrder: cat.displayOrder,
      isActive: cat.isActive,
      artworkCount: countMap[cat.name.toLowerCase()] || 0,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));

    res.json({
      success: true,
      data: enriched,
    });
  } catch (error: any) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve categories',
    });
  }
});

/**
 * GET /api/categories/admin
 * Admin endpoint: returns all categories with total (published + draft) artwork counts
 */
router.get('/admin', authenticateAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, name: 1 });

    // Aggregate all artworks
    const categoryCounts = await Artwork.aggregate([
      { $group: { _id: '$category', total: { $sum: 1 }, published: { $sum: { $cond: ['$isPublished', 1, 0] } } } },
    ]);

    const countMap: Record<string, { total: number; published: number }> = {};
    categoryCounts.forEach((c) => {
      if (c._id) countMap[c._id.toLowerCase()] = { total: c.total, published: c.published };
    });

    const enriched = categories.map((cat) => {
      const counts = countMap[cat.name.toLowerCase()] || { total: 0, published: 0 };
      return {
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        displayOrder: cat.displayOrder,
        isActive: cat.isActive,
        totalArtworks: counts.total,
        publishedArtworks: counts.published,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
      };
    });

    res.json({
      success: true,
      data: enriched,
    });
  } catch (error: any) {
    console.error('Get admin categories error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve admin categories',
    });
  }
});

/**
 * POST /api/categories
 * Admin: Create a new category
 */
router.post('/', authenticateAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, displayOrder } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: 'Category name is required' });
      return;
    }

    const trimmedName = name.trim();
    const slug = slugify(trimmedName);

    // Prevent duplicate category names (case-insensitive)
    const existing = await Category.findOne({
      $or: [
        { slug },
        { name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } },
      ],
    });

    if (existing) {
      res.status(409).json({
        success: false,
        message: `Category "${trimmedName}" already exists.`,
      });
      return;
    }

    // Default display order to highest + 1
    let order = typeof displayOrder === 'number' ? displayOrder : 0;
    if (displayOrder === undefined || displayOrder === null) {
      const highest = await Category.findOne().sort({ displayOrder: -1 });
      order = highest ? highest.displayOrder + 1 : 1;
    }

    const newCategory = await Category.create({
      name: trimmedName,
      slug,
      description: description?.trim() || '',
      displayOrder: order,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: `Category "${newCategory.name}" created successfully.`,
      data: newCategory,
    });
  } catch (error: any) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create category',
    });
  }
});

/**
 * PUT /api/categories/reorder
 * Admin: Reorder categories
 */
router.put('/reorder', authenticateAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderList } = req.body;

    if (!Array.isArray(orderList)) {
      res.status(400).json({ success: false, message: 'Invalid order list format.' });
      return;
    }

    const updateOps = orderList.map((item) =>
      Category.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder })
    );

    await Promise.all(updateOps);

    res.json({
      success: true,
      message: 'Category order updated successfully.',
    });
  } catch (error: any) {
    console.error('Reorder categories error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reorder categories',
    });
  }
});

/**
 * PUT /api/categories/:id
 * Admin: Rename / update category and preserve artwork associations
 */
router.put('/:id', authenticateAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, displayOrder, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    const oldName = category.name;
    const trimmedName = name?.trim();

    if (trimmedName && trimmedName.toLowerCase() !== oldName.toLowerCase()) {
      // Check for duplicate name
      const duplicate = await Category.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
      });

      if (duplicate) {
        res.status(409).json({
          success: false,
          message: `Another category named "${trimmedName}" already exists.`,
        });
        return;
      }

      category.name = trimmedName;
      category.slug = slugify(trimmedName);

      // CRITICAL: Preserve artwork associations when a category is renamed!
      await Artwork.updateMany(
        { category: { $regex: new RegExp(`^${oldName.trim()}$`, 'i') } },
        { category: trimmedName }
      );
    }

    if (description !== undefined) category.description = description.trim();
    if (typeof displayOrder === 'number') category.displayOrder = displayOrder;
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    const saved = await category.save();

    res.json({
      success: true,
      message: `Category "${saved.name}" updated successfully.`,
      data: saved,
    });
  } catch (error: any) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update category',
    });
  }
});

/**
 * DELETE /api/categories/:id
 * Admin: Safely delete category with reassignment strategy
 */
router.delete('/:id', authenticateAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reassignTo } = req.query; // Optional category name to reassign artworks to

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    // Check how many artworks belong to this category
    const associatedArtworks = await Artwork.countDocuments({
      category: { $regex: new RegExp(`^${category.name.trim()}$`, 'i') },
    });

    if (associatedArtworks > 0) {
      if (!reassignTo || typeof reassignTo !== 'string' || !reassignTo.trim()) {
        res.status(400).json({
          success: false,
          requireReassignment: true,
          count: associatedArtworks,
          message: `Category "${category.name}" has ${associatedArtworks} associated artwork(s). Please specify a target category (e.g. 'Other' or another category) to reassign them before deletion.`,
        });
        return;
      }

      const targetCategoryName = (reassignTo as string).trim();
      // Ensure target category exists or is valid
      const targetExists = await Category.findOne({
        name: { $regex: new RegExp(`^${targetCategoryName}$`, 'i') },
      });

      if (!targetExists && targetCategoryName !== 'Other') {
        res.status(400).json({
          success: false,
          message: `Target category "${targetCategoryName}" does not exist for reassignment.`,
        });
        return;
      }

      // Reassign all associated artworks
      await Artwork.updateMany(
        { category: { $regex: new RegExp(`^${category.name.trim()}$`, 'i') } },
        { category: targetCategoryName }
      );
    }

    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Category "${category.name}" deleted successfully. ${
        associatedArtworks > 0 ? `${associatedArtworks} artwork(s) reassigned to "${reassignTo}".` : ''
      }`,
    });
  } catch (error: any) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete category',
    });
  }
});

export default router;
