"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FINAL_6_CATEGORIES = void 0;
exports.runMigration = runMigration;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const Category_1 = require("../models/Category");
const Artwork_1 = require("../models/Artwork");
const category_routes_1 = require("../routes/category.routes");
exports.FINAL_6_CATEGORIES = [
    {
        name: 'Floral & Nature',
        description: 'Includes flowers, plants, birds, animals and landscapes.',
        displayOrder: 1,
    },
    {
        name: 'Figurative & Spiritual',
        description: 'Includes human portraits, Lord Krishna, other deities and spiritual artwork.',
        displayOrder: 2,
    },
    {
        name: 'Abstract & Geometric',
        description: 'Includes abstract designs, geometric patterns and experimental mosaic art.',
        displayOrder: 3,
    },
    {
        name: 'Decorative Art',
        description: 'Includes mirrors, decorative objects, framed pieces and functional art.',
        displayOrder: 4,
    },
    {
        name: 'Art for Spaces',
        description: 'Includes wall installations, murals and custom artwork for homes, offices and other spaces.',
        displayOrder: 5,
    },
    {
        name: 'Other',
        description: 'For artwork that does not fit any of the above categories.',
        displayOrder: 6,
    },
];
const CATEGORY_MAP = {
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
    'floral & nature': 'Floral & Nature',
    'figurative & spiritual': 'Figurative & Spiritual',
    'abstract & geometric': 'Abstract & Geometric',
};
async function runMigration() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/inderpushp_db';
    if (mongoose_1.default.connection.readyState === 0) {
        await mongoose_1.default.connect(uri);
    }
    console.log('Connected to MongoDB for category migration...');
    // 1. Migrate Artworks
    const artworks = await Artwork_1.Artwork.find();
    console.log(`Found ${artworks.length} artwork(s) to inspect for category mapping.`);
    let artworksUpdated = 0;
    for (const artwork of artworks) {
        const currentCatNormalized = (artwork.category || '').trim().toLowerCase();
        const targetCategory = CATEGORY_MAP[currentCatNormalized] || 'Other';
        if (artwork.category !== targetCategory) {
            const oldCategory = artwork.category;
            artwork.category = targetCategory;
            await artwork.save();
            artworksUpdated++;
            console.log(`Updated artwork "${artwork.title}" from "${oldCategory}" -> "${targetCategory}"`);
        }
        else {
            console.log(`Artwork "${artwork.title}" is already in "${artwork.category}"`);
        }
    }
    console.log(`Artworks update complete. (${artworksUpdated} updated)`);
    // 2. Ensure the 6 Final Categories exist and have exact metadata
    const validCategoryNames = exports.FINAL_6_CATEGORIES.map((c) => c.name);
    for (const catData of exports.FINAL_6_CATEGORIES) {
        const slug = (0, category_routes_1.slugify)(catData.name);
        // Find by name (case-insensitive) or slug
        let categoryDoc = await Category_1.Category.findOne({
            $or: [
                { slug },
                { name: { $regex: new RegExp(`^${catData.name.replace('&', '\\&')}$`, 'i') } },
            ],
        });
        if (categoryDoc) {
            categoryDoc.name = catData.name;
            categoryDoc.slug = slug;
            categoryDoc.description = catData.description;
            categoryDoc.displayOrder = catData.displayOrder;
            categoryDoc.isActive = true;
            await categoryDoc.save();
            console.log(`Updated category: "${catData.name}" (Order: ${catData.displayOrder})`);
        }
        else {
            categoryDoc = await Category_1.Category.create({
                name: catData.name,
                slug,
                description: catData.description,
                displayOrder: catData.displayOrder,
                isActive: true,
            });
            console.log(`Created category: "${catData.name}" (Order: ${catData.displayOrder})`);
        }
    }
    // 3. Remove any obsolete categories that are not in the final 6
    const deletedResult = await Category_1.Category.deleteMany({
        name: { $nin: validCategoryNames },
    });
    console.log(`Removed ${deletedResult.deletedCount} old/obsolete category document(s).`);
    // 4. Verification
    const remainingCategories = await Category_1.Category.find().sort({ displayOrder: 1 });
    console.log(`\nFinal Categories in MongoDB (${remainingCategories.length}):`);
    remainingCategories.forEach((c) => {
        console.log(`  [${c.displayOrder}] ${c.name} | slug: ${c.slug} | active: ${c.isActive}`);
    });
    const updatedArtworks = await Artwork_1.Artwork.find();
    console.log(`\nVerification of artworks category distribution:`);
    const distribution = {};
    updatedArtworks.forEach((a) => {
        distribution[a.category] = (distribution[a.category] || 0) + 1;
    });
    console.log(distribution);
}
if (require.main === module) {
    runMigration()
        .then(async () => {
        await mongoose_1.default.disconnect();
        console.log('Migration finished successfully.');
        process.exit(0);
    })
        .catch((err) => {
        console.error('Migration failed:', err);
        process.exit(1);
    });
}
