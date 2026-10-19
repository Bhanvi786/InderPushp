"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const Category_1 = require("../models/Category");
const Artwork_1 = require("../models/Artwork");
async function main() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/inderpushp_db';
    await mongoose_1.default.connect(uri);
    console.log('Connected to MongoDB');
    const categories = await Category_1.Category.find().sort({ displayOrder: 1 });
    console.log('Existing Categories count:', categories.length);
    categories.forEach((c) => {
        console.log(`- [${c.displayOrder}] ${c.name} (slug: ${c.slug}, active: ${c.isActive})`);
    });
    const artworks = await Artwork_1.Artwork.find();
    console.log('\nTotal Artworks:', artworks.length);
    const artworksByCategory = {};
    artworks.forEach((a) => {
        artworksByCategory[a.category] = artworksByCategory[a.category] || [];
        artworksByCategory[a.category].push(a.title);
    });
    console.log('Artworks by category:');
    for (const [cat, titles] of Object.entries(artworksByCategory)) {
        console.log(`  ${cat} (${titles.length}): ${titles.slice(0, 5).join(', ')}${titles.length > 5 ? '...' : ''}`);
    }
    await mongoose_1.default.disconnect();
}
main().catch(console.error);
