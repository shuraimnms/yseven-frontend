#!/usr/bin/env node

/**
 * Asset Compression Script
 * Compresses build assets with Brotli and Gzip
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { brotliCompress, gzip } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const brotliCompressAsync = promisify(brotliCompress);
const gzipAsync = promisify(gzip);

const DIST_DIR = path.join(__dirname, '../dist');
const EXTENSIONS = ['.js', '.css', '.html', '.svg', '.json', '.xml'];

console.log('🗜️  Asset Compression');
console.log('====================\n');

if (!fs.existsSync(DIST_DIR)) {
  console.log('❌ Build directory not found. Run "npm run build" first.\n');
  process.exit(1);
}

async function compressFile(filePath) {
  const ext = path.extname(filePath);
  if (!EXTENSIONS.includes(ext)) return;

  const content = fs.readFileSync(filePath);
  const filename = path.basename(filePath);

  try {
    // Brotli compression
    const brotli = await brotliCompressAsync(content, {
      params: {
        [11]: 11 // Maximum compression level
      }
    });
    fs.writeFileSync(`${filePath}.br`, brotli);

    // Gzip compression
    const gzipped = await gzipAsync(content, {
      level: 9 // Maximum compression
    });
    fs.writeFileSync(`${filePath}.gz`, gzipped);

    const originalSize = content.length;
    const brotliSize = brotli.length;
    const gzipSize = gzipped.length;
    const brotliSavings = ((1 - brotliSize / originalSize) * 100).toFixed(1);
    const gzipSavings = ((1 - gzipSize / originalSize) * 100).toFixed(1);

    console.log(`✓ ${filename}`);
    console.log(`  Original: ${formatBytes(originalSize)}`);
    console.log(`  Brotli:   ${formatBytes(brotliSize)} (${brotliSavings}% smaller)`);
    console.log(`  Gzip:     ${formatBytes(gzipSize)} (${gzipSavings}% smaller)\n`);
  } catch (error) {
    console.error(`✗ Error compressing ${filename}: ${error.message}\n`);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else {
      await compressFile(filePath);
    }
  }
}

// Main execution
(async () => {
  await processDirectory(DIST_DIR);
  
  console.log('✅ Compression complete!\n');
  console.log('📝 Server Configuration:');
  console.log('   Configure your server to serve .br files for Brotli-capable browsers');
  console.log('   and .gz files as fallback. Example nginx config:\n');
  console.log('   gzip_static on;');
  console.log('   brotli_static on;\n');
})();
