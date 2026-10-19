import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

import { Category } from '../models/Category';
import { Artwork } from '../models/Artwork';

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/inderpushp_db';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const categories = await Category.find().sort({ displayOrder: 1 });
  console.log('Existing Categories count:', categories.length);
  categories.forEach((c) => {
    console.log(`- [${c.displayOrder}] ${c.name} (slug: ${c.slug}, active: ${c.isActive})`);
  });

  const artworks = await Artwork.find();
  console.log('\nTotal Artworks:', artworks.length);
  const artworksByCategory: Record<string, string[]> = {};
  artworks.forEach((a) => {
    artworksByCategory[a.category] = artworksByCategory[a.category] || [];
    artworksByCategory[a.category].push(a.title);
  });
  console.log('Artworks by category:');
  for (const [cat, titles] of Object.entries(artworksByCategory)) {
    console.log(`  ${cat} (${titles.length}): ${titles.slice(0, 5).join(', ')}${titles.length > 5 ? '...' : ''}`);
  }

  await mongoose.disconnect();
}

main().catch(console.error);
