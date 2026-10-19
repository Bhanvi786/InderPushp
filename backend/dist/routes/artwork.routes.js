"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Artwork_1 = require("../models/Artwork");
const auth_1 = require("../middleware/auth");
const cloudinary_service_1 = require("../services/cloudinary.service");
const imagekit_service_1 = require("../services/imagekit.service");
const router = (0, express_1.Router)();
/**
 * GET /api/artworks/stats
 * Real aggregated statistics from MongoDB for the Dashboard Overview (Admin Only)
 */
router.get('/stats', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const totalArtworks = await Artwork_1.Artwork.countDocuments();
        const publishedArtworks = await Artwork_1.Artwork.countDocuments({ isPublished: true });
        const draftArtworks = await Artwork_1.Artwork.countDocuments({ isPublished: false });
        const inStockArtworks = await Artwork_1.Artwork.countDocuments({ availability: 'In Stock' });
        const madeToOrderArtworks = await Artwork_1.Artwork.countDocuments({ availability: 'Made to Order' });
        const soldArtworks = await Artwork_1.Artwork.countDocuments({ availability: 'Sold' });
        const enquiryOnlyArtworks = await Artwork_1.Artwork.countDocuments({ availability: 'Enquiry Only' });
        const featuredArtworks = await Artwork_1.Artwork.countDocuments({ isFeatured: true });
        // Available count includes In Stock + Made to Order
        const availableArtworks = inStockArtworks + madeToOrderArtworks;
        // Category breakdown
        const categoryCounts = await Artwork_1.Artwork.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);
        res.json({
            success: true,
            data: {
                totalArtworks,
                publishedArtworks,
                draftArtworks,
                availableArtworks,
                inStockArtworks,
                madeToOrderArtworks,
                soldArtworks,
                enquiryOnlyArtworks,
                featuredArtworks,
                categories: categoryCounts.map((c) => ({ category: c._id, count: c.count })),
            },
        });
    }
    catch (error) {
        console.error('Error fetching artwork stats:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch dashboard statistics.',
        });
    }
});
/**
 * GET /api/artworks/public
 * Public gallery endpoint: returns published artworks ordered by displayOrder then createdAt
 */
router.get('/public', async (req, res) => {
    try {
        const { category, featured } = req.query;
        const filter = { isPublished: true };
        if (category && category !== 'All') {
            filter.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
        }
        if (featured === 'true') {
            filter.isFeatured = true;
        }
        const artworks = await Artwork_1.Artwork.find(filter).sort({ displayOrder: 1, createdAt: -1 });
        res.json({
            success: true,
            count: artworks.length,
            data: artworks,
        });
    }
    catch (error) {
        console.error('Error fetching public artworks:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve gallery artworks.',
        });
    }
});
/**
 * GET /api/artworks
 * Admin endpoint: returns all artworks with search, filter, sorting, and pagination (Admin Only)
 */
router.get('/', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const { search, category, availability, status, sortBy, sortOrder } = req.query;
        const filter = {};
        if (search && typeof search === 'string' && search.trim() !== '') {
            filter.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } },
                { materials: { $regex: search.trim(), $options: 'i' } },
            ];
        }
        if (category && category !== 'All') {
            filter.category = category;
        }
        if (availability && availability !== 'All') {
            filter.availability = availability;
        }
        if (status && status !== 'All') {
            if (status === 'Published')
                filter.isPublished = true;
            if (status === 'Draft')
                filter.isPublished = false;
            if (status === 'Featured')
                filter.isFeatured = true;
        }
        // Sorting
        let sortObj = { displayOrder: 1, createdAt: -1 };
        if (sortBy === 'price') {
            sortObj = { priceINR: sortOrder === 'desc' ? -1 : 1 };
        }
        else if (sortBy === 'title') {
            sortObj = { title: sortOrder === 'desc' ? -1 : 1 };
        }
        else if (sortBy === 'date') {
            sortObj = { createdAt: sortOrder === 'asc' ? 1 : -1 };
        }
        else if (sortBy === 'order') {
            sortObj = { displayOrder: sortOrder === 'desc' ? -1 : 1, createdAt: -1 };
        }
        const artworks = await Artwork_1.Artwork.find(filter).sort(sortObj);
        res.json({
            success: true,
            count: artworks.length,
            data: artworks,
        });
    }
    catch (error) {
        console.error('Error fetching artworks:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve artworks.',
        });
    }
});
/**
 * GET /api/artworks/:id
 * Retrieve a single artwork by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const artwork = await Artwork_1.Artwork.findById(req.params.id);
        if (!artwork) {
            res.status(404).json({ success: false, message: 'Artwork not found.' });
            return;
        }
        res.json({
            success: true,
            data: artwork,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch artwork.',
        });
    }
});
/**
 * POST /api/artworks
 * Admin: Create a new artwork
 */
router.post('/', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const { title, description, category, priceINR, mainImage, additionalImages, dimensions, materials, availability, stockQuantity, estimatedProductionTime, isFeatured, isPublished, displayOrder, } = req.body;
        // Validation
        if (!title || !title.trim()) {
            res.status(400).json({ success: false, message: 'Artwork title is required.' });
            return;
        }
        if (!mainImage || !mainImage.url) {
            res.status(400).json({
                success: false,
                message: 'Main artwork image is required to create or publish a piece.',
            });
            return;
        }
        // Determine default display order if not provided
        let finalOrder = typeof displayOrder === 'number' ? displayOrder : 0;
        if (!displayOrder && displayOrder !== 0) {
            const highestOrderArtwork = await Artwork_1.Artwork.findOne().sort({ displayOrder: -1 });
            finalOrder = highestOrderArtwork ? highestOrderArtwork.displayOrder + 1 : 1;
        }
        const newArtwork = new Artwork_1.Artwork({
            title: title.trim(),
            description: description?.trim() || '',
            category: category || 'Floral & Nature',
            priceINR: typeof priceINR === 'number' ? priceINR : Number(priceINR) || 0,
            mainImage: {
                url: mainImage.url,
                publicId: mainImage.publicId || '',
                alt: mainImage.alt || title.trim(),
                isMain: true,
            },
            additionalImages: Array.isArray(additionalImages) ? additionalImages : [],
            dimensions: dimensions?.trim() || '',
            materials: materials?.trim() || '',
            availability: availability || 'In Stock',
            stockQuantity: typeof stockQuantity === 'number' ? stockQuantity : Number(stockQuantity) || 1,
            estimatedProductionTime: estimatedProductionTime?.trim() || '',
            isFeatured: Boolean(isFeatured),
            isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
            displayOrder: finalOrder,
        });
        const savedArtwork = await newArtwork.save();
        res.status(201).json({
            success: true,
            message: 'Artwork created successfully.',
            data: savedArtwork,
        });
    }
    catch (error) {
        console.error('Create artwork error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to save artwork.',
        });
    }
});
/**
 * PUT /api/artworks/reorder
 * Admin: Bulk update display orders for drag-and-drop gallery management
 * Payload: { orderList: [{ id: string, displayOrder: number }] }
 */
router.put('/reorder', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const { orderList } = req.body;
        if (!Array.isArray(orderList) || orderList.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Invalid order list provided.',
            });
            return;
        }
        const bulkOps = orderList.map((item) => ({
            updateOne: {
                filter: { _id: item.id },
                update: { $set: { displayOrder: item.displayOrder } },
            },
        }));
        await Artwork_1.Artwork.bulkWrite(bulkOps);
        res.json({
            success: true,
            message: 'Gallery display order updated successfully.',
        });
    }
    catch (error) {
        console.error('Reorder error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to save gallery ordering.',
        });
    }
});
/**
 * PUT /api/artworks/:id
 * Admin: Update existing artwork
 */
router.put('/:id', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const existingArtwork = await Artwork_1.Artwork.findById(id);
        if (!existingArtwork) {
            res.status(404).json({ success: false, message: 'Artwork not found.' });
            return;
        }
        const { title, description, category, priceINR, mainImage, additionalImages, dimensions, materials, availability, stockQuantity, estimatedProductionTime, isFeatured, isPublished, displayOrder, } = req.body;
        if (title !== undefined)
            existingArtwork.title = title.trim();
        if (description !== undefined)
            existingArtwork.description = description.trim();
        if (category !== undefined)
            existingArtwork.category = category;
        if (priceINR !== undefined)
            existingArtwork.priceINR = Number(priceINR);
        if (dimensions !== undefined)
            existingArtwork.dimensions = dimensions.trim();
        if (materials !== undefined)
            existingArtwork.materials = materials.trim();
        if (availability !== undefined)
            existingArtwork.availability = availability;
        if (stockQuantity !== undefined)
            existingArtwork.stockQuantity = Number(stockQuantity);
        if (estimatedProductionTime !== undefined)
            existingArtwork.estimatedProductionTime = estimatedProductionTime.trim();
        if (isFeatured !== undefined)
            existingArtwork.isFeatured = Boolean(isFeatured);
        if (isPublished !== undefined)
            existingArtwork.isPublished = Boolean(isPublished);
        if (displayOrder !== undefined)
            existingArtwork.displayOrder = Number(displayOrder);
        // If main image updated, check if old image publicId changed
        if (mainImage && mainImage.url) {
            existingArtwork.mainImage = {
                url: mainImage.url,
                publicId: mainImage.publicId || '',
                alt: mainImage.alt || existingArtwork.title,
                isMain: true,
            };
        }
        if (additionalImages && Array.isArray(additionalImages)) {
            existingArtwork.additionalImages = additionalImages;
        }
        const updated = await existingArtwork.save();
        res.json({
            success: true,
            message: 'Artwork updated successfully.',
            data: updated,
        });
    }
    catch (error) {
        console.error('Update artwork error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update artwork.',
        });
    }
});
/**
 * PATCH /api/artworks/:id/publish
 * Admin: Toggle published state
 */
router.patch('/:id/publish', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const artwork = await Artwork_1.Artwork.findById(req.params.id);
        if (!artwork) {
            res.status(404).json({ success: false, message: 'Artwork not found.' });
            return;
        }
        artwork.isPublished = !artwork.isPublished;
        await artwork.save();
        res.json({
            success: true,
            message: artwork.isPublished ? 'Artwork published.' : 'Artwork saved as draft.',
            data: artwork,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Toggle publish failed.' });
    }
});
/**
 * PATCH /api/artworks/:id/featured
 * Admin: Toggle featured state
 */
router.patch('/:id/featured', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const artwork = await Artwork_1.Artwork.findById(req.params.id);
        if (!artwork) {
            res.status(404).json({ success: false, message: 'Artwork not found.' });
            return;
        }
        artwork.isFeatured = !artwork.isFeatured;
        await artwork.save();
        res.json({
            success: true,
            message: artwork.isFeatured ? 'Artwork marked as featured.' : 'Artwork unfeatured.',
            data: artwork,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Toggle featured failed.' });
    }
});
/**
 * DELETE /api/artworks/:id
 * Admin: Delete artwork and safely cleanup associated Cloudinary images
 */
router.delete('/:id', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const artwork = await Artwork_1.Artwork.findById(req.params.id);
        if (!artwork) {
            res.status(404).json({ success: false, message: 'Artwork not found.' });
            return;
        }
        // Collect public IDs to safely clean up from Cloudinary
        const publicIdsToClean = [];
        if (artwork.mainImage?.publicId) {
            publicIdsToClean.push(artwork.mainImage.publicId);
        }
        if (artwork.additionalImages && artwork.additionalImages.length > 0) {
            artwork.additionalImages.forEach((img) => {
                if (img.publicId)
                    publicIdsToClean.push(img.publicId);
            });
        }
        // Delete record from database
        await Artwork_1.Artwork.findByIdAndDelete(req.params.id);
        // Safely attempt ImageKit & Cloudinary deletion in background (won't fail request if storage is offline)
        if (publicIdsToClean.length > 0) {
            Promise.all(publicIdsToClean.map(async (pid) => {
                const ikDone = await (0, imagekit_service_1.deleteFromImageKit)(pid);
                if (!ikDone) {
                    await (0, cloudinary_service_1.deleteFromCloudinary)(pid);
                }
            })).catch((err) => console.warn('Background image cleanup notice:', err));
        }
        res.json({
            success: true,
            message: `Artwork "${artwork.title}" was successfully deleted.`,
        });
    }
    catch (error) {
        console.error('Delete artwork error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete artwork.',
        });
    }
});
exports.default = router;
