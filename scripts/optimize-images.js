#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts PNG/JPG to WebP and generates responsive sizes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const PUBLIC_DIR = path.join(__dirname, '../public');

console.log('🖼️  Image Optimization Script');
console.log('================================\n');

// Check if sharp is available
let sharp;
try {
  sharp = (await import('sharp')).default;
  console.log('✅ Sharp library loaded\n');
} catch (error) {
  console.log('⚠️  Sharp not installed. Install with: npm install -D sharp\n');
  console.log('📝 Manual optimization recommendations:');
  console.log('   1. Convert PNG/JPG to WebP format');
  console.log('   2. Compress images to 80-85% quality');
  console.log('   3. Generate responsive sizes (320w, 640w, 1024w, 1920w)');
  console.log('   4. Use lazy loading for images below the fold');
  console.log('   5. Serve images via CDN if possible\n');
  process.exit(0);
}

// Image optimization settings
const SIZES = [320, 640, 1024, 1920];
const QUALITY = 85;

async function optimizeImage(filePath, outputDir) {
  const filename = path.basename(filePath, path.extname(filePath));
  const ext = path.extname(filePath).toLowerCase();
  
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
    return;
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    console.log(`📸 Processing: ${filename}${ext} (${metadata.width}x${metadata.height})`);

    // Generate WebP version
    await image
      .webp({ quality: QUALITY })
      .toFile(path.join(outputDir, `${filename}.webp`));
    
    console.log(`   ✓ Created WebP version`);

    // Generate responsive sizes
    for (const size of SIZES) {
      if (size < metadata.width) {
        await sharp(filePath)
          .resize(size, null, { withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toFile(path.join(outputDir, `${filename}-${size}w.webp`));
        
        console.log(`   ✓ Created ${size}w version`);
      }
    }
    
    console.log('');
  } catch (error) {
    console.error(`   ✗ Error processing ${filename}: ${error.message}\n`);
  }
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else {
      await optimizeImage(filePath, dir);
    }
  }
}

// Main execution
(async () => {
  console.log('Processing assets directory...\n');
  await processDirectory(ASSETS_DIR);
  
  console.log('\n✅ Image optimization complete!\n');
  console.log('📊 Next steps:');
  console.log('   1. Update image imports to use WebP versions');
  console.log('   2. Implement <picture> elements with srcset for responsive images');
  console.log('   3. Add loading="lazy" to images below the fold');
  console.log('   4. Consider using a CDN for image delivery\n');
})();
